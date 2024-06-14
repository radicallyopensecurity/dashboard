const MEMBERS_BASE = {
  id: 1,
  state: 'active',
  locked: false,
  avatar_url: null,
  access_level: 50,
  created_at: '2023-10-05T22:37:19.422Z',
  created_by: {
    id: 1,
    username: 'user-1',
    name: 'User 1',
    state: 'active',
    locked: false,
    avatar_url: null,
    web_url: 'https://localhost/git/user-1',
  },
  expires_at: null,
}

export const buildMember = (name: string) => {
  return {
    ...MEMBERS_BASE,
    username: name,
    name: name,
    web_url: `https://localhost/git/${name}`,
  }
}
