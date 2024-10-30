import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";

const ProtectedRoute = ({ children }) => {
  const [isLogin, setIsLogin] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // const uid = user.uid;
      } else {
        setIsLogin(false);
        navigate("/login");
      }
    });
  }, []);
  return isLogin && children;
};

export default ProtectedRoute;
