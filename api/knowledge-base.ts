import { http } from '@/hooks/use-http'
import { KnowledgeBase } from '@/types'
import { first } from 'lodash-es'

export async function loadKnowledgeBases() {
  return http.get<KnowledgeBase[]>(`/api/knowledge-base`)
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
  const file = first(fileList)

  if (file) {
    formData.append('file', file)
  }

  return http.post<unknown>(`/api/upload-file`, formData)
}
