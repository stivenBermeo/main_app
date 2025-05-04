import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify';

import './index.css'
import App from './App.tsx'
import Detail from './Detail.tsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/"  element={<App />}/>
          <Route path="/detail/:entryId"  element={<Detail />}/>
        </Routes>
        </QueryClientProvider>
    </BrowserRouter>
    <ToastContainer/>
  </StrictMode>
)
