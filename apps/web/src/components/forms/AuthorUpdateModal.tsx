import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUpdateAuthor } from '@/hooks/useAuthors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import type { Author } from '@/types'

const schema = z.object({
  name: z.string().min(1, '* Please enter name'),
})

type FormValues = z.infer<typeof schema>

interface AuthorUpdateModalProps {
  author: Author | null
  onClose: () => void
}

export default function AuthorUpdateModal({ author, onClose }: AuthorUpdateModalProps) {
  const updateAuthor = useUpdateAuthor()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (author) reset({ name: author.name })
  }, [author, reset])

  const onSubmit = (values: FormValues) => {
    if (!author) return
    updateAuthor.mutate(
      { id: author.id, payload: values },
      { onSuccess: () => { reset(); onClose() } }
    )
  }

  return (
    <Dialog open={!!author} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Author</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} placeholder="Author name" />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={updateAuthor.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateAuthor.isPending}>
              {updateAuthor.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
