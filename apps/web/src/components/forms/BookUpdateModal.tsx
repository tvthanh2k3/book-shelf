import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUpdateBook, useAllAuthors } from '@/hooks/useBooks'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Book } from '@/types'

const schema = z.object({
  title: z.string().min(1, '* Please enter name'),
  author_id: z.coerce.number({ invalid_type_error: '* Please select author' }).min(1, '* Please select author'),
})

type FormValues = z.infer<typeof schema>

interface BookUpdateModalProps {
  book: Book | null
  onClose: () => void
}

export default function BookUpdateModal({ book, onClose }: BookUpdateModalProps) {
  const updateBook = useUpdateBook()
  const { data: authors } = useAllAuthors()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (book) reset({ title: book.title, author_id: book.author_id })
  }, [book, reset])

  const onSubmit = (values: FormValues) => {
    if (!book) return
    updateBook.mutate(
      { id: book.id, payload: values },
      { onSuccess: () => { reset(); onClose() } }
    )
  }

  return (
    <Dialog open={!!book} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Book</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} placeholder="Book title" />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Author</Label>
            <Select
              value={watch('author_id') ? String(watch('author_id')) : ''}
              onValueChange={(val) => setValue('author_id', Number(val), { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select author" />
              </SelectTrigger>
              <SelectContent>
                {authors?.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.author_id && (
              <p className="text-xs text-destructive">{errors.author_id.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={updateBook.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateBook.isPending}>
              {updateBook.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
