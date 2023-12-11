import { Navigate } from "react-router-dom";
const Protected = ({children}) => {
  if (!localStorage.getItem('token') || !localStorage.getItem('name') || !localStorage.getItem('role')) {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    localStorage.removeItem('role')
    return <Navigate to="/" replace />;
  }
  return children;
};
export default Protected;