import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import BookingManager from './Components/Bookings/BookingManager'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Home/>
    </>
  )
}

export default App
