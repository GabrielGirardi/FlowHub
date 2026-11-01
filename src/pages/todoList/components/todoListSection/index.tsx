import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { Todo } from '@/pages/todoList/hooks/useTodo.ts'
import { TodoItem } from '../todoItem'

type Props = {
  todos: Todo[]
  emptyState: React.ReactNode
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoListSection({
  todos,
  emptyState,
  onToggle,
  onDelete
}: Props) {
  if (todos.length === 0) return <>{emptyState}</>

  return (
    <AnimatePresence>
      <motion.div className="space-y-3 w-full">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
