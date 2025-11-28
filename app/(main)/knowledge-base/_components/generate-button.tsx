'use client'

import { generateKnowledgeBase, loadKnowledgeBases } from '@/api/knowledge-base'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { KnowledgeBase, UIText } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Printer } from 'lucide-react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { Select } from 'antd'

const schema = z.object({
  knowledgeIds: z.array(z.string()).min(1),
  advice: z.string().min(1),
})

export default function GenerateButton() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [KnowledgeBases, setKnowledgeBases] = React.useState<KnowledgeBase[]>()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isLoadingOfSubmit, setIsLoadingOfSubmit] = React.useState(false)
  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'all',
    defaultValues: {
      knowledgeIds: [],
      advice: '',
    },
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      setIsLoadingOfSubmit(true)
      await generateKnowledgeBase({
        knowledgeIds: values.knowledgeIds,
        advice: values.advice,
      })
      setIsOpen(false)
      toast.success('Generated Successfully')
    } catch {
    } finally {
      setIsLoadingOfSubmit(false)
    }
  }

  async function onOpenChange(open: boolean) {
    setIsOpen(open)
    if (open) {
      reset()

      try {
        setIsLoading(true)

        const { data } = await loadKnowledgeBases({ type: 'raw' })

        setKnowledgeBases(data)
      } catch {
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Printer /> Generate
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Generate {UIText.Documentation}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="py-4 grid gap-4">
            <div className="grid gap-3">
              <Label>Knowledge</Label>
              <Controller
                control={control}
                name="knowledgeIds"
                render={({ field }) => (
                  <Select
                    {...field}
                    mode="multiple"
                    maxTagTextLength={20}
                    allowClear
                    loading={isLoading}
                    options={KnowledgeBases?.map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))}
                    getPopupContainer={(triggerNode) =>
                      triggerNode.parentElement
                    }
                  />
                )}
              />
            </div>
            <div className="grid gap-3">
              <Label>Advice</Label>
              <Controller
                control={control}
                name="advice"
                render={({ field }) => <Textarea {...field} className="h-60" />}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoadingOfSubmit || !isValid}>
              {isLoadingOfSubmit && <Spinner />}
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
