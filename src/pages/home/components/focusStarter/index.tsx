import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, ListTodo, Play } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useTimer } from '@/contexts/TimerContext'
import { useTranslator } from '@/hooks/useTranslate'
import { useTodos } from '@/pages/todoList/hooks/useTodo'

const NEW_TASK = 'new-task'

export function FocusStarter() {
  const { t } = useTranslator('home')
  const navigate = useNavigate()
  const { pendingTodos, addTodo } = useTodos()
  const { activeTab, isRunning, changeMode, startPauseTimer } = useTimer()
  const [selectedTaskId, setSelectedTaskId] = useState(
    () => pendingTodos[0]?.id ?? NEW_TASK
  )
  const [newTaskText, setNewTaskText] = useState('')

  const selectedTask = pendingTodos.find(todo => todo.id === selectedTaskId)
  const canStart = selectedTaskId === NEW_TASK
    ? newTaskText.trim().length > 0
    : Boolean(selectedTask)

  const startFocus = () => {
    const task = selectedTaskId === NEW_TASK
      ? addTodo(newTaskText)
      : selectedTask

    if (!task) return

    localStorage.setItem('activePomodoroTaskId', task.id)

    if (activeTab !== 'pomodoro') {
      changeMode('pomodoro')
    }

    if (activeTab !== 'pomodoro' || !isRunning) {
      startPauseTimer()
    }

    navigate('/pomodoro')
  }

  return (
    <section className="mx-auto w-full max-w-xl rounded-2xl border border-primary/20 bg-card/80 p-4 text-left shadow-xl backdrop-blur-md sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-2 text-primary">
          <Clock size={20} />
        </div>
        <div>
          <h2 className="font-semibold">{t('main.focus.title')}</h2>
          <p className="text-sm text-muted-foreground">{t('main.focus.description')}</p>
        </div>
      </div>

      {selectedTaskId === NEW_TASK && (
        <div className="mb-3 flex items-center gap-2">
          <ListTodo size={16} className="shrink-0 text-muted-foreground" />
          <Input
            value={newTaskText}
            onChange={event => setNewTaskText(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter' && canStart) startFocus()
            }}
            placeholder={t('main.focus.newTaskPlaceholder')}
            aria-label={t('main.focus.newTaskPlaceholder')}
            className="h-10 bg-background"
          />
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="min-w-0 flex-1">
          <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
            <SelectTrigger aria-label={t('main.focus.taskLabel')} className="h-11 w-full bg-background">
              <SelectValue placeholder={t('main.focus.taskPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {pendingTodos.map(todo => (
                <SelectItem key={todo.id} value={todo.id}>
                  {todo.text}
                </SelectItem>
              ))}
              <SelectItem value={NEW_TASK}>
                {t('main.focus.newTask')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          onClick={startFocus}
          disabled={!canStart}
          className="h-11 w-full shrink-0 gap-2 sm:w-auto"
        >
          <Play size={16} fill="currentColor" />
          {t('main.focus.start')}
        </Button>
      </div>
    </section>
  )
}
