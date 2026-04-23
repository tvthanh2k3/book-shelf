import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateBook, useAllAuthors } from '@/hooks/useBooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const schema = z.object({
  title: z.string().min(1, '* Please enter name'),
  author_id: z.string().min(1, '* Please select author'),
})

type FormValues = z.infer<typeof schema>

export default function BooksCreate() {
  const navigate = useNavigate()
  const createBook = useCreateBook()
  const { data: authors } = useAllAuthors()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = (values: FormValues) => {
    createBook.mutate(
      { title: values.title, author_id: Number(values.author_id) },
      { onSuccess: () => navigate('/books/list') }
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Create Book</h1>
        <p className="text-sm text-muted-foreground mt-1">Add a new book to the list</p>
      </div>

      <div className="max-w-md rounded-lg border bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              value={watch('author_id') ?? ''}
              onValueChange={(val) => setValue('author_id', val, { shouldValidate: true })}
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

          <div className="flex gap-3 pt-1">
            <Button type="submit" disabled={createBook.isPending}>
              {createBook.isPending ? 'Creating...' : 'Create'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/books/list')}
              disabled={createBook.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
