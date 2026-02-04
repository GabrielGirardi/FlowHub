import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Target, Trophy } from 'lucide-react'

import { useTodos } from '@/pages/todoList/hooks/useTodo.ts'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Translator, TextTypeEnum } from '@/utils/translator'
import { useTranslator } from '@/hooks/useTranslate'

import { AddTodoForm } from './components/addTodoForm'
import { TodoListSection } from './components/todoListSection'
import { EmptyState } from './components/emptyState'

function TodoList() {
  const { t } = useTranslator('todo')

  const {
    pendingTodos,
    completedTodos,
    addTodo,
    toggleTodo,
    deleteTodo
  } = useTodos()

  return (
    <div className="flex flex-col gap-4 h-screen overflow-hidden">
      <Card className="flex  border-sidebar-border">
        <CardHeader className="flex items-center gap-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 0.7, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <div className="relative inline-block">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary via-primary/60 to-primary rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative flex items-center justify-center bg-background rounded-full p-4 border border-primary/20 shadow-2xl">
                    <Zap size={24} className="text-primary" />
                </div>
            </div>
          </motion.div>
          <CardTitle className="text-xl">
            <Translator origin="todo" text="main.title" type={TextTypeEnum.TITLE} />
          </CardTitle>
        </CardHeader>
      </Card>

      <AddTodoForm onAdd={addTodo} placeholder={t('main.placeholder')} />

      <Card className="flex border-sidebar-border h-3/4">
        <CardHeader className="flex items-center gap-4 w-full">
          <CardTitle className="flex w-1/2">
            <Translator origin="todo" text="main.pending.tab" type={TextTypeEnum.TITLE} />
          </CardTitle>
          <CardTitle className="flex w-1/2">
            <Translator origin="todo" text="main.done.tab" type={TextTypeEnum.TITLE} />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center gap-4 h-full">
          <div className="flex w-1/2 h-full overflow-y-scroll">
            <TodoListSection
              todos={pendingTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              emptyState={
                <EmptyState
                  icon={Target}
                  accentColor="orange"
                  title={t('main.pending.title')}
                  description={t('main.pending.description')}
                />
              }
            />
          </div>
          <div className="flex w-1/2 h-full overflow-y-scroll">
            <TodoListSection
              todos={completedTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              emptyState={
                <EmptyState
                  icon={Trophy}
                  accentColor="green"
                  title={t('main.done.title')}
                  description={t('main.done.description')}
                />
              }
          />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TodoList
