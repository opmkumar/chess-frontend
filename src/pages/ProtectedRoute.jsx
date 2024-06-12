import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "@/features/userSlice";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(
    function () {
      const isAuth = sessionStorage.getItem("isAuthenticated") === "true";
      if (isAuth) {
        dispatch(login());
      } else if (!isAuthenticated) {
        navigate("/");
      }
    },
    [isAuthenticated, navigate, dispatch],
  );
  return isAuthenticated ? children : null;
}

export default ProtectedRoute;
