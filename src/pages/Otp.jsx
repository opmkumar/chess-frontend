import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "../features/userSlice";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";

function Otp() {
  const [otp, setOtp] = useState("");
  const { login } = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const state = useSelector((store) => store.user);
  // console.log(state);
  // console.log(state.email);
  function handleSubmit(e) {
    e.preventDefault();
    // console.log(otp);
    if (!otp) return;
    dispatch(verifyOtp({ otp }));
  }

  useEffect(
    function () {
      if (state.isAuthenticated === true) {
        login();
        navigate("/app/home", { replace: true });
      }
    },
    [navigate, state.isAuthenticated, login, state.email],
  );
  return (
    <main className="py- m-0 min-h-screen bg-slate-400 px-0.5 py-1">
      <form
        className=" mx-32 my-auto flex w-[48rem] flex-col rounded-lg bg-slate-600 px-8 py-12"
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="otp">OTP</label>
          <input
            type="text"
            id="username"
            onChange={(e) => setOtp(Number(e.target.value))}
            value={otp}
          />
        </div>

        <div>
          <button>Verify</button>
        </div>
      </form>
    </main>
  );
}

export default Otp;
