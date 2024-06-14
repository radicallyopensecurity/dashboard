export const generateEventDetails = (
  id: number,
  action: string,
  title: string,
  author: string,
  createdAt: string
) => {
  return {
    id,
    action_name: action,
    target_title: title,
    author: {
      id: 1,
      username: author,
      name: author,
      state: 'active',
      locked: false,
      avatar_url: null,
      web_url: `https://localhost/git/${author}`,
    },
    author_username: author,
    created_at: createdAt,
  }
}
