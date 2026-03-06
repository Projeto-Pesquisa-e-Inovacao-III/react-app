import axios from "axios"

export const BASE_URL = "http://localhost:8080/api"

export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
})

const exceptions = ["/", "/login", "/register", "/forgot-password", "/logout", "/no-code-tool"];

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