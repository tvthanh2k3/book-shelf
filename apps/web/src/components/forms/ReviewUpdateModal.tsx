import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUpdateReview } from '@/hooks/useReviews'
import { useAllBooks } from '@/hooks/useBooks'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import FieldError from '@/components/common/FieldError'
import type { Review } from '@/types'

const schema = z.object({
  book_id: z.string().min(1, '* Please select book'),
  review: z.string().min(1, '* Please enter review'),
})

type FormValues = z.infer<typeof schema>

interface ReviewUpdateModalProps {
  review: Review | null
  onClose: () => void
}

export default function ReviewUpdateModal({ review, onClose }: ReviewUpdateModalProps) {
  const updateReview = useUpdateReview()
  const { data: books } = useAllBooks()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (review) reset({ book_id: String(review.book_id), review: review.review })
  }, [review, reset])

  const onSubmit = (values: FormValues) => {
    if (!review) return
    updateReview.mutate(
      { id: review.id, payload: { book_id: Number(values.book_id), review: values.review } },
      { onSuccess: () => { reset(); onClose() } }
    )
  }

  return (
    <Dialog open={!!review} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Review</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
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
            <FieldError message={errors.book_id?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="review">Review</Label>
            <Textarea
              id="review"
              {...register('review')}
              placeholder="Write your review..."
              className="min-h-28 resize-none"
            />
            <FieldError message={errors.review?.message} />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={updateReview.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateReview.isPending}>
              {updateReview.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
