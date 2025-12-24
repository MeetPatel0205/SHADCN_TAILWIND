import React, { createContext, useContext, useState, useEffect } from "react"

interface User {
    name: string
    email: string
    avatar: string
}

interface AuthContextType {
    user: User | null
    token: string | null
    id: string | null
    login: (token: string, userData: User) => void
    logout: () => void
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)

    // Load token/user from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")

        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
        }
    }, [])

    const login = (newToken: string, userData: User) => {
        setToken(newToken)
        setUser(userData)
        localStorage.setItem("token", newToken)
        localStorage.setItem("user", JSON.stringify(userData))
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        // Optional: Redirect to login
        window.location.href = "/login"
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                id: null,
                login,
                logout,
                isAuthenticated: !!token
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
