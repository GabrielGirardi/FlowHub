import React from 'react'
import { useTranslator } from '@/hooks/useTranslate'
import {
    Zap,
    Layout,
    Globe,
    Music,
} from 'lucide-react'

type Category = {
    id: string
    name: string
    icon: React.ComponentType<{ className?: string }>;
    description: string
    color: string
}

export function useCategoriesData(): Category[] {
    const { t } = useTranslator('home')

    return [
        {
            id: 'productivity',
            name: t('categories.productivity.title'),
            icon: Zap,
            description: t('categories.productivity.description'),
            color: 'from-blue-500 to-cyan-500'
        },
        {
            id: 'development',
            name: t('categories.development.title'),
            icon: Layout,
            description: t('categories.development.description'),
            color: 'from-purple-500 to-pink-500'
        },
        {
            id: 'utilities',
            name: t('categories.utilities.title'),
            icon: Globe,
            description: t('categories.utilities.description'),
            color: 'from-green-500 to-emerald-500'
        },
        {
            id: 'entertainment',
            name:  t('categories.entertainment.title'),
            icon: Music,
            description:  t('categories.entertainment.description'),
            color: 'from-orange-500 to-red-500'
        },
    ]
}
