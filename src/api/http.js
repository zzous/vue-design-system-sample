import axios from 'axios'

const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const data = error.response?.data
    const serverMessage =
      (typeof data === 'string' && data) ||
      data?.message ||
      data?.error ||
      null

    if (status === 401) {
      localStorage.removeItem('accessToken')
    }

    const message = serverMessage || (status ? `HTTP ${status}` : error.message)
    return Promise.reject(new Error(message))
  },
)

export default http
