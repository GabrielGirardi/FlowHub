import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'

import { Checkbox } from '@/components/ui/checkbox.tsx'
import { Label } from '@/components/ui/label.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Todo } from '@/pages/todoList/hooks/useTodo.ts'

type Props = {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <motion.div layout className="group">
      <div className="flex items-center justify-between px-4 py-2 rounded-xl border border-sidebar-border">
        <div className="flex items-center space-x-3 flex-1">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => onToggle(todo.id)}
            className={`cursor-pointer ${todo.completed ? '!border-green-500 !bg-green-500' : 'border-red-500'}`}
          />
          <Label
            className={`flex-1 cursor-pointer w-24 overflow-y-scroll flex flex-wrap break-words whitespace-pre-wrap ${
              todo.completed ? 'line-through text-muted-foreground' : ''
            }`}
          >
            {todo.text}
          </Label>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(todo.id)}
          className="opacity-0 group-hover:opacity-100 cursor-pointer hover:text-red-500 transition-colors duration-300"
        >
          <Trash2 className="hover:!text-red-500" size={16} />
        </Button>
      </div>
    </motion.div>
  )
}
