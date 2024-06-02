import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUser } from "../features/userSlice";

function Login() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((store) => store.user);

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(getUser({ password, email }));
    navigate("/verify-otp");
  }

  return (
    <main className="py- m-0 min-h-screen bg-slate-400 px-0.5 py-1">
      <form
        className=" mx-32 my-auto flex w-[48rem] flex-col rounded-lg bg-slate-600 px-8 py-12"
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <button>LOGIN</button>
        </div>
      </form>
    </main>
  );
}

export default Login;
