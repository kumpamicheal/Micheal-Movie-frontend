import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('admin');
        if (stored) {
            const { user } = JSON.parse(stored);
            setUser(user);
        }
    }, []);

    const isAdmin = user?.role === 'admin'; // adjust depending on your token's role field

    return (
        <AuthContext.Provider value={{ user, setUser, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};
