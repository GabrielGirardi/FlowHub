import { useState } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Props = {
  onAdd: (text: string) => void
  placeholder: string
}

export function AddTodoForm({ onAdd, placeholder }: Props) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(value)
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
        className="border border-sidebar-border"
      />
      <Button type="submit" className="bg-card cursor-pointer hover:bg-card/80 border border-sidebar-border hover:border-green-500">
        <Plus size={18} className="text-primary" />
      </Button>
    </form>
  )
}
