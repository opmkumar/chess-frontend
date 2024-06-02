import { NavLink } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <NavLink to="/signup">Signup</NavLink>
      <NavLink to="/login">Login</NavLink>
    </div>
  );
}

export default HomePage;
