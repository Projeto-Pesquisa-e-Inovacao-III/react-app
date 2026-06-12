import axios from "axios"

export const BASE_URL = import.meta.env.VITE_BASE_URL ?? "http://localhost:8080/api"

export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
})

const exceptions = ["/", "/login", "/register", "/forgot-password", "/logout", "/dev-seed"];

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            if (!exceptions.includes(window.location.pathname)) {
                window.location.href = "/login"
            }
        }

        return Promise.reject(error)
    }
)