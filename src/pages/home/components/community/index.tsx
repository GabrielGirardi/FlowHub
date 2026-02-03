import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import { useTranslator } from '@/hooks/useTranslate'

export const Community: React.FC = () => {
  const { t } = useTranslator('home')

  return (
    <motion.div
        className="mt-20 p-12 border border-border rounded-3xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm text-center relative overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
    >
        <motion.h2
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {t('main.community.title')}
          </motion.h2>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t("main.community.description")}
          </p>

          <div className="text-muted-foreground">
            <p className="mb-2">{t('main.community.opensource')}</p>
            <Link
              to="https://github.com/GabrielGirardi/FlowHub"
              className="text-primary hover:text-primary/80 font-semibold text-lg transition-colors"
              target="_blank"
            >
              {t('main.community.contribute')}
            </Link>
          </div>
    </motion.div>
  )
}