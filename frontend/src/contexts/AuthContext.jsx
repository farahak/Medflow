'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // -------------------------------------------
  // Load user on first app load
  // -------------------------------------------
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedAccess = localStorage.getItem('access_token')

    if (storedUser && storedAccess) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error loading user:', error)
        localStorage.clear()
      }
    }
  }, [])

  // -------------------------------------------
  // SIGNUP
  // -------------------------------------------
  const signup = useCallback(async (email, password, first_name, last_name, role) => {
    setLoading(true)
    try {
      const response = await api.post('/users/signup/', { 
        email, password, first_name, last_name, role 
      })
      return response.data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // -------------------------------------------
  // LOGIN
  // -------------------------------------------
  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const response = await api.post('/users/login/', { email, password })
      const { access, refresh, user } = response.data

      if (!access || !refresh) {
        throw new Error("Invalid login response from backend")
      }

      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
      localStorage.setItem('user', JSON.stringify(user))

      setUser(user)
      setIsAuthenticated(true)
      return user
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // -------------------------------------------
  // LOGOUT
  // -------------------------------------------
  const logout = useCallback(() => {
    localStorage.clear()
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
