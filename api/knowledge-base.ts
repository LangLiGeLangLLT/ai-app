import { http } from '@/hooks/use-http'
import { KnowledgeBase } from '@/types'

export async function loadKnowledgeBases({
  type,
}: {
  type: KnowledgeBase['type']
}) {
  return http.get<KnowledgeBase[]>(`/api/knowledge-base`, {
    params: {
      type,
    },
  })
}

export async function createKnowledgeBase({ name, content }: KnowledgeBase) {
  return http.post<unknown>(`/api/knowledge-base`, {
    name,
    content,
  })
}

export async function updateKnowledgeBase({
  id,
  name,
  content,
}: KnowledgeBase) {
  return http.post<unknown>(`/api/knowledge-base`, {
    id,
    name,
    content,
  })
}

export async function deleteKnowledgeBase({ id }: KnowledgeBase) {
  return http.delete<unknown>(`/api/knowledge-base/${id}`)
}

export async function uploadFile(fileList: File[]) {
  const formData = new FormData()

  for (const file of fileList) {
    formData.append(file.name, file)
  }

  return http.post<unknown>(`/api/upload-file`, formData)
}

export async function generateKnowledgeBase({
  knowledgeIds,
  advice,
}: {
  knowledgeIds: KnowledgeBase['id'][]
  advice: string
}) {
  return http.post<unknown>(`/api/knowledge-base/summary`, {
    knowledge_base_id_list: knowledgeIds,
    user_advance: advice,
  })
}
