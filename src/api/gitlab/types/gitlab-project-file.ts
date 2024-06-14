export type GitLabProjectFile = {
  file_name: string
  file_path: string
  size: number
  encoding: string
  content_sha256: string
  ref: string
  blob_id: string
  commit_id: string
  last_commit_id: string
  execute_filemode: boolean
  content: string
}
