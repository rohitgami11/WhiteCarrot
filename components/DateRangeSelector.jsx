'use client'

import { useState } from 'react'

export default function DateRangeSelector({ onDateRangeSelect }) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onDateRangeSelect(startDate, endDate)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex space-x-4">
      <div>
        <label>Start Date:</label>
        <input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)}
          className="border px-2 py-1"
        />
      </div>
      <div>
        <label>End Date:</label>
        <input 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)}
          className="border px-2 py-1"
        />
      </div>
      <button 
        type="submit" 
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Fetch Events
      </button>
    </form>
  )
}