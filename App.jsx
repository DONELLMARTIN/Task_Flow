import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './LoginPage'
import Register from './RegisterPage'
import TaskMan from './TaskManager'
import Admin from './AdminPanel'
import Home from './HomePage'
import Dashboard from "./DashboardPage";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/' element={<Home />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/admin' element={<Admin />}></Route>
        <Route path='/tasks' element={<TaskMan />}></Route>
        <Route path="/dashboard" element={<Dashboard />} />


      </Routes>

    </BrowserRouter>
  )
}

export default App;
