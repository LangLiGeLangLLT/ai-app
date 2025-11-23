'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { RefreshCcw, SquarePen, Trash } from 'lucide-react'
import AddResource from './_components/add-resource'
import { KnowledgeBase } from '@/types'
import { loadKnowledgeBases } from '@/api/knowledge-base'

export default function Page() {
  const [knowledgeBases, setKnowledgeBases] = React.useState<KnowledgeBase[]>()
  const [isLoading, setIsLoading] = React.useState(true)

  async function init() {
    try {
      setIsLoading(true)
      const { data } = await loadKnowledgeBases()
      setKnowledgeBases(data)
    } catch {
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    init()
  }, [])

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex gap-4">
        <Button>
          <RefreshCcw /> Refresh
        </Button>
        <AddResource />
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        {isLoading ? (
          <Skeleton />
        ) : (
          knowledgeBases?.map((knowledgeBase) => (
            <Card key={knowledgeBase.id} className="gap-2 pb-2">
              <CardHeader>
                <CardTitle>{knowledgeBase.title}</CardTitle>
                <CardDescription>{knowledgeBase.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="ml-auto" variant="ghost" size="icon">
                  <SquarePen />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash />
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

function Skeleton() {
  return (
    <>
      {new Array(16).fill(0).map((_, i) => (
        <div key={i} className="bg-muted/50 aspect-video rounded-xl" />
      ))}
    </>
  )
}
