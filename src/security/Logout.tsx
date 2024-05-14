import { useAuth } from "./AuthProvider";
import { Navigate } from "react-router-dom";


function LogoutComponent() {
  const auth = useAuth();
  auth.signOut()
  return <Navigate to="/" replace= {true} />;
}

export default LogoutComponent;
