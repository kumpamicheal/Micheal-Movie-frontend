// src/components/routes/AdminPrivateRoute.jsx
import { Navigate } from 'react-router-dom';

const AdminPrivateRoute = ({ children }) => {
    const admin = JSON.parse(localStorage.getItem('admin'));

    if (!admin || !admin.token) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default AdminPrivateRoute;
