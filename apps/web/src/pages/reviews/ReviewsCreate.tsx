import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateReview, useAllBooks } from '@/hooks/useReviews'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const schema = z.object({
  book_id: z.string().min(1, '* Please select book'),
  review: z.string().min(1, '* Please enter review'),
})

type FormValues = z.infer<typeof schema>

export default function ReviewsCreate() {
  const navigate = useNavigate()
  const createReview = useCreateReview()
  const { data: books } = useAllBooks()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = (values: FormValues) => {
    createReview.mutate(
      { book_id: Number(values.book_id), review: values.review },
      { onSuccess: () => navigate('/reviews/list') }
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Create Review</h1>
        <p className="text-sm text-muted-foreground mt-1">Add a new book review</p>
      </div>

      <div className="max-w-md rounded-lg border bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label>Book</Label>
            <Select
              value={watch('book_id') ?? ''}
              onValueChange={(val) => setValue('book_id', val, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select book" />
              </SelectTrigger>
              <SelectContent>
                {books?.map((b) => (
                  <SelectItem key={b.id} value={String(b.id)}>
                    {b.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.book_id && (
              <p className="text-xs text-destructive">{errors.book_id.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="review">Review</Label>
            <Textarea
              id="review"
              {...register('review')}
              placeholder="Write your review..."
              className="min-h-28 resize-none"
            />
            {errors.review && (
              <p className="text-xs text-destructive">{errors.review.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="submit" disabled={createReview.isPending}>
              {createReview.isPending ? 'Creating...' : 'Create'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/reviews/list')}
              disabled={createReview.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
