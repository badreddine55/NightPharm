import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // Assuming you store the role in localStorage after login

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If the user's role is not in the allowed roles, redirect to a fallback route (e.g., Dashboard)
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/Dashboard" replace />; // Redirect to a default route
  }

  // If the user's role is allowed, render the children
  return children;
};

export default ProtectedRoute;