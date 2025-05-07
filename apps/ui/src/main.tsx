import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import { ToastContainer } from 'react-toastify';

import './index.css'
import App from './App.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <div className='bg-primary'>
         <a className="btn btn-primary w-50 text-center d-inline-block" href='/'>Home</a>
         <a className="btn btn-primary w-50 text-center d-inline-block" href='/journal'>Journal</a>
      </div>
        <Routes>
          <Route path="/"  element={<div></div>}/>
          <Route path="/journal"  element={<App/>}/>
        </Routes>
    </BrowserRouter>
    <ToastContainer/>
  </StrictMode>
)
