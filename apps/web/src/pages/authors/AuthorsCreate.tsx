import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateAuthor } from '@/hooks/useAuthors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  name: z.string().min(1, '* Please enter name'),
})

type FormValues = z.infer<typeof schema>

export default function AuthorsCreate() {
  const navigate = useNavigate()
  const createAuthor = useCreateAuthor()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = (values: FormValues) => {
    createAuthor.mutate(values, {
      onSuccess: () => navigate('/authors/list'),
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Create Author</h1>
        <p className="text-sm text-muted-foreground mt-1">Add a new author to the list</p>
      </div>

      <div className="max-w-md rounded-lg border bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} placeholder="Author name" />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="submit" disabled={createAuthor.isPending}>
              {createAuthor.isPending ? 'Creating...' : 'Create'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/authors/list')}
              disabled={createAuthor.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
