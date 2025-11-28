export enum UIText {
  AppName = 'Super AI',
  KnowledgeBase = 'Knowledge Base',
  AIChat = 'AI Chat',
  Documentation = 'Documentation',
}

export type KnowledgeBase = Partial<{
  id: string
  name: string
  content: string
  type: 'raw' | 'processed'
}>
