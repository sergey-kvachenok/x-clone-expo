import { useAuth } from '@clerk/clerk-expo'
import axios, { AxiosInstance } from 'axios'

// const API_URL = 'https://x-clone-expo.vercel.app/api'
const API_URL =  'http://192.168.0.165:5001/api'


// Создание API клиента с токеном
const createApiClient = (getToken: () => Promise<string | null>): AxiosInstance => {
  const api = axios.create({ baseURL: API_URL })

  api.interceptors.request.use(async config => {
    try {
      const token = await getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error('Error getting token:', error)
    }
    return config
  })

  return api
}

// Hook для использования в React компонентах
export const useApiClient = (): AxiosInstance => {
  const { getToken } = useAuth()
  return createApiClient(getToken)
}

export const userApi = {
  syncUser: (api: AxiosInstance) => api.post('/users/sync'),
  getCurrentUser: (api: AxiosInstance) => api.get('/users/me'),
  updateProfile: (api: AxiosInstance, userData: any) => api.put('/users/profile', userData),
}

export const postApi = {
  createPost: (api: AxiosInstance, data: { content: string; image?: string }) =>
    api.post("/posts/create", data),
  getPosts: (api: AxiosInstance) => api.get("/posts"),
  getUserPosts: (api: AxiosInstance, username: string) => api.get(`/posts/user/${username}`),
  likePost: (api: AxiosInstance, postId: string) => api.post(`/posts/${postId}/like`),
  deletePost: (api: AxiosInstance, postId: string) => api.delete(`/posts/${postId}`),
};

export const commentApi = {
  createComment: (api: AxiosInstance, postId: string, content: string) =>
    api.post(`/comments/post/${postId}`, { content }),
};


// // Функция для получения токена в любом месте приложения
// export const getAuthToken = async (): Promise<string | null> => {
//   try {
//     // Динамически импортируем Clerk чтобы избежать проблем с SSR
//     const { getClerkInstance } = await import('@clerk/clerk-expo')
//     const clerk =  getClerkInstance()
    
//     if (clerk?.session) {
//       return await clerk.session.getToken()
//     }
    
//     return null
//   } catch (error) {
//     console.error('Error getting auth token:', error)
//     return null
//   }
// }

// // API клиент для использования вне React компонентов
// export const createAuthenticatedApiClient = async (): Promise<AxiosInstance> => {
//   return createApiClient(getAuthToken)
// }

// // Утилиты для работы с пользователем
// export const userApi = {
//   syncUser: async (userId: string) => {
//     const token = await getAuthToken()
//     if (!token) {
//       throw new Error('User not authenticated')
//     }

//     const response = await fetch(`${API_URL}/api/users/sync`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ userId }),
//     })

//     if (!response.ok) {
//       throw new Error('Failed to sync user')
//     }

//     return response.json()
//   },

//   getCurrentUser: async () => {
//     const token = await getAuthToken()
//     if (!token) {
//       throw new Error('User not authenticated')
//     }

//     const response = await fetch(`${API_URL}/api/users/me`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })

//     if (!response.ok) {
//       throw new Error('Failed to get current user')
//     }

//     return response.json()
//   },
// }

// // Класс для более сложной работы с API
// export class UserApi {
//   private apiClient: AxiosInstance | null = null

//   constructor() {
//     this.initializeApiClient()
//   }

//   private async initializeApiClient() {
//     this.apiClient = await createAuthenticatedApiClient()
//   }

//   private async ensureApiClient(): Promise<AxiosInstance> {
//     if (!this.apiClient) {
//       await this.initializeApiClient()
//     }
//     if (!this.apiClient) {
//       throw new Error('Failed to initialize API client')
//     }
//     return this.apiClient
//   }

//   async syncUser(userId: string) {
//     const api = await this.ensureApiClient()
//     const response = await api.post('/api/users/sync', { userId })
//     return response.data
//   }

//   async updateUser(userData: any) {
//     const api = await this.ensureApiClient()
//     const response = await api.put('/api/users/me', userData)
//     return response.data
//   }
// }

// // Экспорт экземпляра класса
// export const userApiInstance = new UserApi()