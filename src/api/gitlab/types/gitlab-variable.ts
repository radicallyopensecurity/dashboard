export type GitLabVariable = {
  variable_type: string
  key: string
  value: string
  hidden: boolean
  protected: boolean
  masked: boolean
  raw: boolean
  environment_scope: string
  description: string | null
}