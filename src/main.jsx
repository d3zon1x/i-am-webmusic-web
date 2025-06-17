import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import './index.css'
import RequireAuth from "@/components/auth/RequireAuth.jsx";
import ResetPassword from "@/pages/ResetPassword.jsx";
import RedirectIfAuthenticated from "@/components/auth/RedirectIfAuthenticated.jsx"
import {MusicProvider, useMusic} from "@/contexts/MusicContext.jsx";
import ArtistPage from "@/components/artist/ArtistPage.jsx";
import GlobalPlayerWrapper from "@/pages/GlobalPlayerWrapper.jsx"



ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <MusicProvider>
            <BrowserRouter>
                <GlobalPlayerWrapper />
                
            <Routes>
                <Route
                    path="/"
                    element={
                        <RedirectIfAuthenticated>
                            <App />
                        </RedirectIfAuthenticated>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <RequireAuth>
                            <Dashboard />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/artist/:name"
                    element={
                        <RequireAuth>
                            <ArtistPage/>
                        </RequireAuth>
                    }
                />
                <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
               
            
            </BrowserRouter>
        </MusicProvider>
    </React.StrictMode>,
)
