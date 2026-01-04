// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Define types for API responses
export interface Skill {
  id: number
  title: string
  description: string
  teacher_id: number
  teacher?: User
  rating: number
  review_count: number
  tokens_per_session: number
  category: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  language: string
  availability?: Array<{ day: string; timeSlots: string[] }>
}

export interface User {
  id: number
  email: string
  full_name: string
  bio?: string
  avatar_url?: string
  token_balance: number
  streak?: number
  created_at?: string
  updated_at?: string
}

export interface SkillReview {
  id: number
  skill_id: number
  reviewer_id: number
  reviewer?: User
  rating: number
  comment: string
  created_at?: string
}

export interface Session {
  id: number
  skill_id: number
  teacher_id: number
  student_id: number
  scheduled_at: string
  duration_minutes: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

export interface Chat {
  id: number
  user_1_id: number
  user_2_id: number
  created_at?: string
}

export interface Message {
  id: number
  chat_id: number
  sender_id: number
  content: string
  created_at?: string
}

export interface Transaction {
  id: number
  user_id: number
  amount: number
  type: 'earn' | 'spend'
  description: string
  created_at?: string
}

// Helper function to make API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  // Attach Authorization header when running in the browser and a token exists
  const authHeader: Record<string, string> = {}
  try {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token")
      if (token) authHeader["Authorization"] = `Bearer ${token}`
    }
  } catch {
    // ignore localStorage access errors
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || `API Error: ${response.status}`)
  }

  return response.json()
}

// Skills API
export const skillsAPI = {
  getAll: (filters?: {
    category?: string
    level?: string
    language?: string
    search?: string
  }) => {
    const params = new URLSearchParams()
    if (filters?.category) params.append('category', filters.category)
    if (filters?.level) params.append('level', filters.level)
    if (filters?.language) params.append('language', filters.language)
    if (filters?.search) params.append('search', filters.search)
    
    const queryString = params.toString()
    const endpoint = queryString ? `/skills?${queryString}` : '/skills'
    return apiCall<Skill[]>(endpoint)
  },

  getById: (id: number) => apiCall<Skill>(`/skills/${id}`),

  create: (skill: Omit<Skill, 'id' | 'rating' | 'review_count'>) =>
    apiCall<Skill>('/skills', {
      method: 'POST',
      body: JSON.stringify(skill),
    }),

  update: (id: number, updates: Partial<Omit<Skill, 'id' | 'rating' | 'review_count' | 'teacher_id'>>) =>
    apiCall<Skill>(`/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  delete: (id: number) =>
    apiCall<{ message: string }>(`/skills/${id}`, {
      method: 'DELETE',
    }),

  getReviews: (skillId: number) =>
    apiCall<SkillReview[]>(`/skills/${skillId}/reviews`),

  addReview: (skillId: number, review: { rating: number; comment: string }) =>
    apiCall<SkillReview>(`/skills/${skillId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    }),
}

// Users API
export const usersAPI = {
  getCurrentUser: () => apiCall<User>('/users/me'),

  getById: (id: number) => apiCall<User>(`/users/${id}`),

  update: (updates: Partial<User>) =>
    apiCall<User>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
}

// Sessions API
export const sessionsAPI = {
  getAll: () => apiCall<Session[]>('/sessions'),

  getUpcoming: () => apiCall<Session[]>('/sessions/upcoming'),

  book: (session: Omit<Session, 'id' | 'status'>) =>
    apiCall<Session>('/sessions', {
      method: 'POST',
      body: JSON.stringify(session),
    }),

  confirm: (sessionId: number) =>
    apiCall<Session>(`/sessions/${sessionId}/confirm`, {
      method: 'POST',
    }),

  decline: (sessionId: number) =>
    apiCall<Session>(`/sessions/${sessionId}/decline`, {
      method: 'POST',
    }),

  cancel: (sessionId: number) =>
    apiCall<Session>(`/sessions/${sessionId}/cancel`, {
      method: 'POST',
    }),

  complete: (sessionId: number) =>
    apiCall<Session>(`/sessions/${sessionId}/complete`, {
      method: 'POST',
    }),
}

// Chats API
export const chatsAPI = {
  getAll: () => apiCall<Chat[]>('/chats'),

  getMessages: (chatId: number) =>
    apiCall<Message[]>(`/chats/${chatId}/messages`),

  sendMessage: (chatId: number, content: string) =>
    apiCall<Message>(`/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  getOrCreate: (userId: number) => apiCall<Chat>(`/chats`, {
    method: 'POST',
    body: JSON.stringify({ user_id: userId }),
  }),
}

// Transactions API
export const transactionsAPI = {
  getAll: () => apiCall<Transaction[]>('/transactions'),

  getBalance: () => apiCall<{ balance: number }>('/transactions/balance'),
}

// Auth API
export const authAPI = {
  register: (credentials: { email: string; password: string; full_name: string }) =>
    apiCall<{ access_token: string; token_type: string; user: User }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    ),

  login: (credentials: { email: string; password: string }) =>
    apiCall<{ access_token: string; token_type: string; user: User }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    ),
}
