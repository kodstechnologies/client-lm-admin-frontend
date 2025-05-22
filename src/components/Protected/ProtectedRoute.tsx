// components/ProtectedRoute.tsx
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { IRootState } from '../../store';

interface Props {
    children: JSX.Element;
}

const ProtectedRoute = ({ children }: Props) => {
    const auth = useSelector((state: IRootState) => state.userConfig.auth);
    const location = useLocation();

    if (!auth) {
        // Not logged in
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Logged in but OTP not yet verified is allowed
    return children;
};

export default ProtectedRoute;
