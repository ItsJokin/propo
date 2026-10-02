// Reference implementation — secure file storage (Supabase Storage, private bucket "documents", EU region).
// Paths: {workspace_id}/vault/{id} and {workspace_id}/projects/{project_id}/{id}
// Encryption at rest (AES-256) is provided by the storage layer; TLS in transit.
import { createServiceClient, requireMember } from '../supabase';

const MAX_BYTES = 200 * 1024 * 1024;
const ALLOWED = ['application/pdf', 'application/zip', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

// POST /api/files/upload-url { kind: 'vault' | 'project', projectId?, name, size, type }
export async function createUploadUrl(req: Request) {
  const body = await req.json();
  const { workspace } = await requireMember(req, 'editor');
  if (body.size > MAX_BYTES) return Response.json({ error: 'file_too_large' }, { status: 413 });
  if (!ALLOWED.includes(body.type)) return Response.json({ error: 'unsupported_file' }, { status: 415 });
  const id = crypto.randomUUID();
  const path = body.kind === 'vault' ? `${workspace.id}/vault/${id}` : `${workspace.id}/projects/${body.projectId}/${id}`;
  const db = createServiceClient();
  const { data, error } = await db.storage.from('documents').createSignedUploadUrl(path);
  if (error) return Response.json({ error: 'storage_unavailable' }, { status: 503 });
  return Response.json({ id, path, url: data.signedUrl, token: data.token });
}

// GET /api/files/:id/url — short-lived signed download link, after re-checking membership
export async function signedDownload(req: Request, id: string) {
  const { workspace, user } = await requireMember(req, 'reviewer');
  const db = createServiceClient();
  const { data: doc } = await db.from('vault_documents').select('storage_path, workspace_id, name').eq('id', id).single();
  if (!doc || doc.workspace_id !== workspace.id) return Response.json({ error: 'not_found' }, { status: 404 }); // never reveal other tenants' ids
  const { data } = await db.storage.from('documents').createSignedUrl(doc.storage_path, 60, { download: doc.name });
  await db.from('audit_log').insert({ workspace_id: workspace.id, actor: user.id, action: 'document.downloaded', target_type: 'vault_document', target_id: id });
  return Response.json({ url: data!.signedUrl });
}

// Deletion: file, chunks (cascade), evidence links; logged. Retention job deletes source
// documents of projects closed longer than workspaces.data_retention_months.
export async function deleteDocument(req: Request, id: string) {
  const { workspace, user } = await requireMember(req, 'editor');
  const db = createServiceClient();
  const { data: doc } = await db.from('vault_documents').select('storage_path').eq('id', id).eq('workspace_id', workspace.id).single();
  if (!doc) return Response.json({ error: 'not_found' }, { status: 404 });
  await db.storage.from('documents').remove([doc.storage_path]);
  await db.from('vault_documents').delete().eq('id', id);
  await db.from('audit_log').insert({ workspace_id: workspace.id, actor: user.id, action: 'document.deleted', target_id: id });
  return new Response(null, { status: 204 });
}
