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

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex gap-4">
        <Button>
          <RefreshCcw /> Refresh
        </Button>
        <AddResource />
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        {new Array(36).fill(0).map((_, i) => (
          <Card key={i} className="gap-2 pb-2">
            <CardHeader>
              <CardTitle>Title</CardTitle>
              <CardDescription>Description</CardDescription>
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
        ))}
      </div>
    </div>
  )
}
