import React, { useState, useEffect } from 'react'
import axiosInstance from '../utils/axiosInstance'
import { HomeHeader } from '../components/Home'
import { Sidebar } from '../components/Home'

const History = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axiosInstance.get('/users/history')
        console.log("Fetching user history...", response.data.data)
        setHistory(response.data.data)
      } catch (error) {
        console.error("Error fetching history:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  return (
    <>
        <HomeHeader />
        <Sidebar />
        <div className='mx-auto p-4 bg-gray-900 pt-16'>
            <h1 className='text-2xl font-bold text-white'>User History</h1>
            {loading ? (
            <p className='text-white'>Loading...</p>
            ) : history.length > 0 ? (
            <ul className='list-disc pl-5 text-white'>
                {history.map((item, index) => (
                <li key={item._id || index} className='mb-2'>
                    {item.video?.title || 'Untitled Video'} —{' '}
                    {new Date(item.createdAt).toLocaleString()}
                </li>
                ))}
            </ul>
            ) : (
            <p className='text-white'>No history available.</p>
            )}
        </div>
    </>

    
  )
}

export default History
