import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <div className="bg-blue-500 text-white p-8 text-center">
      <h1 className="text-3xl font-bold">✅ Tailwind Đã Hoạt Động!</h1>
      <p className="text-lg mt-4">Không còn lỗi 500 nữa</p>
      <button className="bg-green-500 hover:bg-green-700 px-4 py-2 rounded mt-4 text-white">
        Test Button
      </button>
    </div>
    </>
  )
}

export default App
