import { useTranslation } from 'react-i18next'

export function useTranslator(namespace?: string) {
  const { t } = useTranslation(namespace)

  const translate = (key: string) => t(key)

  return { t: translate }
}
