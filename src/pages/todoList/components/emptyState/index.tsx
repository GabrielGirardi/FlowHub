import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description?: string
  accentColor?: 'green' | 'orange' | 'primary'
}

const colorMap = {
  green: {
    bg: 'bg-green-500/10',
    text: 'text-green-500',
    glow: 'from-green-500/30 to-transparent'
  },
  orange: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-500',
    glow: 'from-orange-500/30 to-transparent'
  },
  primary: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    glow: 'from-primary/30 to-transparent'
  }
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  accentColor = 'primary'
}: EmptyStateProps) {
  const colors = colorMap[accentColor]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative flex flex-col items-center justify-center py-14 px-6 text-center rounded-2xl border border-border/50 bg-background/60 backdrop-blur-sm overflow-hidden w-full"
    >
      <div
        className={`absolute -inset-1 bg-gradient-to-b ${colors.glow} blur-2xl opacity-50`}
      />

      <div className="relative mb-5">
        <div
          className={`absolute -inset-1 rounded-full blur-md opacity-70 ${colors.bg}`}
        />
        <div
          className={`relative flex items-center justify-center w-20 h-20 rounded-full ${colors.bg} border border-border shadow-md`}
        >
          <Icon size={42} className={colors.text} />
        </div>
      </div>

      <h3 className="relative text-xl font-semibold mb-2">
        {title}
      </h3>

      {description && (
        <p className="relative text-muted-foreground max-w-md leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  )
}
