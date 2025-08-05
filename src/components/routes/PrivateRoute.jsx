import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // two folders up from routes/

const PrivateRoute = ({ children }) => {
    const { isAdmin } = useContext(AuthContext);

    if (!isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default PrivateRoute;
