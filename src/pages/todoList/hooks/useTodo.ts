import { useState } from 'react'

import { useToast } from '@/hooks/use-toast'

export type Todo = {
  id: string
  text: string
  completed: boolean
}

export function useTodos() {
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
      title: 'Tarefa adicionada',
      description: 'Nova tarefa criada com sucesso.'
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
      title: 'Tarefa removida',
      description: 'A tarefa foi excluída com sucesso.'
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
