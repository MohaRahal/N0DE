export type CommandStep = { label: string; command: string }

export type Command = {
  id: string
  title: string
  command: string
  description: string
  category: string
  tags: string[]
  explanation?: string
  example?: string
  parameters?: { key: string; value: string }[]
  steps?: CommandStep[]
  custom?: boolean
}

export type CommandDraft = Omit<Command, 'id' | 'custom'>
export type ViewFilter = 'all' | 'favorites' | 'most-used' | 'recent'
