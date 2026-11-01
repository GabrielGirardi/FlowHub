import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import { useCategoriesData } from '../../hooks/useCategoriesData'
import { useToolsData } from '../../hooks/useToolsData'

export const Category: React.FC = () => {
    const categories = useCategoriesData()
    const tools = useToolsData()

    const getToolsByCategory = (categoryId: string) => {
        return tools.filter(tool => tool.category === categoryId)
    }

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 },
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    return (
        <>
            {categories.map((category, categoryIndex) => {
                const Icon = category.icon

                return (
                    <motion.section
                        key={category.id}
                        className="mb-20"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1,
                                    delay: categoryIndex * 0.1
                                }
                            }
                        }}
                    >
                        <motion.div
                            className="text-center mb-12"
                            variants={item}
                        >
                            <div className={`inline-flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r ${category.color} text-white shadow-xl mb-6`}>
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <h2 className="text-3xl font-bold">{category.name}</h2>
                                    <p className="text-white/90 text-sm">{category.description}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            variants={container}
                        >
                            {getToolsByCategory(category.id).map((tool) => {
                                const Icon = tool.icon
                                return (
                                    <motion.div key={tool.name} variants={item}>
                                        <Link to={tool.path} className="block h-full group">
                                            <motion.div
                                                className={`relative p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm h-full transition-all duration-300 overflow-hidden ${
                                            tool.highlight ? 'ring-2 ring-primary/20' : ''
                                        }`}
                                                whileHover={{
                                                    y: -8,
                                                    scale: 1.02,
                                                    boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)"
                                                }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                {tool.highlight && (
                                                    <div className="absolute -top-0 -right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-semibold">
                                                        Popular
                                                    </div>
                                                )}

                                                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>

                                                <div className="relative z-10">
                                                    <div className="mb-4 p-3 bg-primary/10 rounded-xl w-fit group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                                                        <div className="text-primary">
                                                            <Icon className="w-5 h-5" />
                                                        </div>
                                                    </div>

                                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                                        {tool.name}
                                                    </h3>

                                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                                        {tool.description}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    </motion.section>
                )
            })}
        </>
    )
}