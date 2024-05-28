export type GitLabLabel = {
  id: number
  name: string
  description?: string
  description_html: string
  text_color: string
  color: string
  subscribed: boolean
  priority: unknown
  is_project_label: boolean
}
