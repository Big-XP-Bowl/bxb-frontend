import './App.css'
import Home from './components/Home';
import Login from './security/Login';
import { Route, Routes } from 'react-router-dom'

// make routes here!

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
    </>
  )
}

export default App
