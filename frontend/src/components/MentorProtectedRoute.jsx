import { Navigate } from "react-router-dom";

const MentorProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("mentor_access_token");

    if (!token) {
        return <Navigate to="/mentor/login/" replace />;
    }

    return children;
};

export default MentorProtectedRoute;