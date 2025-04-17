import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import './index.css'
import RequireAuth from "@/components/auth/RequireAuth.jsx";
import ResetPassword from "@/pages/ResetPassword.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route
                    path="/dashboard"
                    element={
                        <RequireAuth>
                            <Dashboard />
                        </RequireAuth>
                    }
                />

                <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
)
