import { http } from '@/hooks/use-http'
import { KnowledgeBase } from '@/types'

export async function loadKnowledgeBases() {
  return http.get<KnowledgeBase[]>(`/api/knowledge-base`)
}
