import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import PrivateRoute from './components/routes/PrivateRoute';
import GenrePage from './components/routes/GenrePage';
import SearchResults from './pages/SearchResults';
import Library from './pages/Library'; // ✅ New Import

import Footer from './components/Footer';
import TopNav from './components/TopNav';

import './App.css';

// Wrapper to handle conditional layout
const AppWrapper = () => {
    const location = useLocation();
    const path = location.pathname;

    // Show TopNav only on home, genre, and search pages
    const showTopNav =
        path === '/' ||
        /^\/genre\/[a-z-]+$/.test(path) ||
        path.startsWith('/search');

    // Hide footer on admin-related routes
    const hideFooterOnRoutes = ['/admin/login', '/admin/dashboard'];
    const shouldHideFooter = hideFooterOnRoutes.includes(path);

    return (
        <div className="App">
            {showTopNav && <TopNav />}

            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/genre/:genre" element={<GenrePage />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/library" element={<Library />} /> {/* ✅ NEW Route */}

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                    path="/admin/dashboard"
                    element={
                        <PrivateRoute>
                            <AdminDashboard />
                        </PrivateRoute>
                    }
                />
            </Routes>

            {!shouldHideFooter && <Footer />}
        </div>
    );
};

function App() {
    return (
        <Router>
            <AppWrapper />
        </Router>
    );
}

export default App;
