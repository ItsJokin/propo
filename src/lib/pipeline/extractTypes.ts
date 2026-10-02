import type { ReqCategory } from '../types';

export interface DocPages { id: string; name: string; pages: string[]; }

/** Shape produced by both the AI extractor and the rule-based extractor. */
export interface ExtractionResult {
  summary: string;
  authority: string;
  reference: string;
  cpv?: string;
  budget?: string;
  duration?: string;
  deadline: string | null;
  deadlines: { label: string; date: string; docName?: string; page?: number }[];
  pageLimit?: string;
  requirements: {
    title: string; category: ReqCategory; quote: string; docName: string; page: number;
    mandatory: boolean; critical: boolean; clause?: string;
    match?: { status: 'fulfilled' | 'needs_info' | 'missing'; evidenceIds: string[]; ask?: string };
  }[];
  criteria: { group: string; name: string; points: number; kind: 'judgement' | 'formula'; description: string; docName: string; page: number }[];
  requiredDocuments: string[];
  exclusionRisks: { text: string; docName?: string; page?: number }[];
  structure: { title: string; guidance: string; criteria: string[] }[];
}
