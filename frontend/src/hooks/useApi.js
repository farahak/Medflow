import { useState, useCallback } from 'react'
import api from '../api/axios'

export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const request = useCallback(async (method, url, payload = null) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api({
        method,
        url,
        data: payload,
      })
      setData(response.data)
      return response.data
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getProfile = useCallback(() => request('get', '/user/me/'), [request])

  const addAvailability = useCallback((date, start_time, end_time) =>
    request('post', '/availability/', { date, start_time, end_time }), [request])

  const getMyAvailabilities = useCallback(() => request('get', '/availability/me/'), [request])

  const createAppointment = useCallback((doctor_id, availability_id) =>
    request('post', '/appointments/', { doctor_id, availability_id }), [request])

  const getUserAppointments = useCallback(() => request('get', '/appointments/me/'), [request])

  const getDoctorAppointments = useCallback(() => request('get', '/appointments/my-appointments/'), [request])

  const getAllAppointments = useCallback(() => request('get', '/appointments/'), [request])

  return {
    request,
    loading,
    error,
    data,
    getProfile,
    addAvailability,
    getMyAvailabilities,
    createAppointment,
    getUserAppointments,
    getDoctorAppointments,
    getAllAppointments
  }
}
