// Reference — Supabase clients. Service client bypasses RLS: use it only in trusted
// server code (webhooks, jobs) and always filter by workspace_id explicitly.
import { createClient } from '@supabase/supabase-js';

export function createServiceClient() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
}

/** Resolves the signed-in user and their active workspace, and checks the minimum role. Throws 401/403. */
export async function requireMember(req: Request, minRole: 'owner' | 'admin' | 'editor' | 'reviewer') {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const db = createServiceClient();
  const { data: { user } } = await db.auth.getUser(token);
  if (!user) throw new Response('unauthorized', { status: 401 });
  const workspaceId = req.headers.get('x-workspace-id');
  const { data: m } = await db.from('memberships').select('role, workspaces(*)').eq('user_id', user.id).eq('workspace_id', workspaceId).eq('status', 'active').single();
  const order = ['owner', 'admin', 'editor', 'reviewer'];
  if (!m || order.indexOf(m.role) > order.indexOf(minRole)) throw new Response('forbidden', { status: 403 });
  return { user, workspace: (m as any).workspaces, role: m.role };
}
