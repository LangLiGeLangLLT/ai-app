import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  stepCountIs,
} from 'ai'
import { qwen } from '@/lib/ai/qwen'
import {
  experimental_createMCPClient as createMCPClient,
  experimental_MCPClient as MCPClient,
} from '@ai-sdk/mcp'
import prompt from './prompt.md'
import z from 'zod'
import { retrieve } from '@/lib/actions/retrieve'

export const maxDuration = 30

export async function POST(req: Request) {
  const {
    messages,
    model,
    webSearch,
  }: {
    messages: UIMessage[]
    model: string
    webSearch: boolean
  } = await req.json()

  let sseClient: MCPClient | null = null
  let sseClientTools = null

  try {
    if (webSearch) {
      sseClient = await createMCPClient({
        transport: {
          type: 'sse',
          url: 'https://dashscope.aliyuncs.com/api/v1/mcps/WebSearch/sse',
          headers: {
            Authorization: `Bearer ${process.env.DASHSCOPE_API_KEY}`,
          },
        },
      })
      sseClientTools = await sseClient.tools({
        schemas: {
          bailian_web_search: {
            description:
              'Search can be used to query information such as encyclopedia knowledge, current news, weather, etc.',
            inputSchema: z.object({
              query: z.string().describe('user query in the format of string'),
              count: z.number().optional().describe('number of search results'),
            }),
          },
        },
      })
    }
  } catch {}

  const result = streamText({
    model: qwen(model),
    messages: convertToModelMessages(messages),
    system: prompt,
    prepareStep: async ({ messages }) => {
      if (messages.length > 20) {
        return {
          messages: messages.slice(-10),
        }
      }
      return {}
    },
    stopWhen: stepCountIs(5),
    tools: {
      ...(webSearch ? sseClientTools : {}),
      retrieve: tool({
        description: `Get information from your knowledge base to answer questions.`,
        inputSchema: z.object({
          query: z.string().describe(`the users query`),
        }),
        execute: async ({ query }) => retrieve(query),
      }),
    },
    onFinish: async () => {
      await sseClient?.close()
    },
    onError: async () => {
      await sseClient?.close()
    },
  })

  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  })
}
