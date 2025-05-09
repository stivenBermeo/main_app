import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import { ToastContainer } from 'react-toastify';

import './index.css'
import App from './App.tsx'
import NavBar from './NavBar.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path="/"  element={<div></div>}/>
        <Route path="/journal"  element={<App/>}/>
      </Routes>
    </BrowserRouter>
    <ToastContainer/>
  </StrictMode>
)
