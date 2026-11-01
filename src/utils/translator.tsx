import React from 'react'
import { useTranslation } from 'react-i18next'

export enum TextTypeEnum {
  TITLE = 'title',
  SUBTITLE = 'subtitle',
  DESCRIPTION = 'description',
}

type TranslatorProps = {
  origin: string
  text: string
  type?: TextTypeEnum
}

export function Translator({
  origin,
  text,
  type = TextTypeEnum.DESCRIPTION,
}: TranslatorProps) {
  const { t } = useTranslation(origin);

  switch (type) {
    case TextTypeEnum.TITLE:
      return <h1>{t(text)}</h1>;
    case TextTypeEnum.SUBTITLE:
      return <h2>{t(text)}</h2>;
    default:
      return <p>{t(text)}</p>;
  }
}
