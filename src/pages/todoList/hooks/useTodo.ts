import { useState } from 'react'

import { useToast } from '@/hooks/use-toast'
import { useTranslation } from 'react-i18next'

export type Todo = {
  id: string
  text: string
  completed: boolean
}

export function useTodos() {
  const { t } = useTranslation('todo')
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })

  const { toast } = useToast()

  const saveTodos = (updated: Todo[]) => {
    localStorage.setItem('todos', JSON.stringify(updated))
    setTodos(updated)
  }

  const addTodo = (text: string) => {
    if (!text.trim()) return

    const todo: Todo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false
    }

    saveTodos([...todos, todo])

    toast({
      title: t('toast.added.title'),
      description: t('toast.added.description')
    })
  }

  const toggleTodo = (id: string) => {
    saveTodos(
      todos.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    )
  }

  const deleteTodo = (id: string) => {
    saveTodos(todos.filter(t => t.id !== id))

    toast({
      title: t('toast.removed.title'),
      description: t('toast.removed.description')
    })
  }

  return {
    todos,
    pendingTodos: todos.filter(t => !t.completed),
    completedTodos: todos.filter(t => t.completed),
    addTodo,
    toggleTodo,
    deleteTodo
  }
}
