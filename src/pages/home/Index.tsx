import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Zap } from 'lucide-react'

import { useTranslator } from '@/hooks/useTranslate'

import { useCategoriesData } from './hooks/useCategoriesData'
import { useToolsData } from './hooks/useToolsData'
import { Category } from './components/category';
import { Community } from './components/community';

const Index = () => {
    const { t } = useTranslator('home')

    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"])

    const categories = useCategoriesData()
    const tools = useToolsData()

    return (
        <div ref={containerRef} className="min-h-screen">
            <motion.section
                className="relative h-screen flex items-center justify-center overflow-hidden"
                style={{ y: backgroundY }}
            >
                <motion.div
                    className="relative z-10 text-center px-4 max-w-6xl mx-auto"
                    style={{ y: textY }}
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="mb-8"
                    >
                        <div className="relative inline-block">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary via-primary/60 to-primary rounded-full blur-2xl opacity-30 animate-pulse"></div>
                            <div className="relative flex items-center justify-center bg-background rounded-full p-8 border border-primary/20 shadow-2xl">
                                <Zap size={80} className="text-primary" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-7xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60 mb-6"
                    >
                        FlowHub
                    </motion.h1>

                    <motion.p
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-2xl md:text-3xl text-muted-foreground mb-8 leading-relaxed"
                    >
                        {t('main.subtitle.start')}
                        <span className="text-primary font-semibold">{t('main.subtitle.middle')}</span> {t('main.and')}
                        <span className="text-primary font-semibold ml-2">{t('main.subtitle.end')}</span>
                    </motion.p>

                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                        className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground"
                    >
                        <span className="px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                            {tools.length} {t('main.tags.tools')}
                        </span>
                        <span className="px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                            {categories.length} {t('main.tags.categories')}
                        </span>
                        <span className="px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                            100% {t('main.tags.free')}
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.9, duration: 0.8 }}
                        className="mt-12"
                    >
                        <div className="animate-bounce">
                            <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
                                <div className="w-1 h-3 bg-primary/50 rounded-full mt-2 animate-pulse"></div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.section>

            <div className="py-20 px-4 max-w-7xl mx-auto">
                <Category />
                <Community />
            </div>
        </div>
    )
}

export default Index