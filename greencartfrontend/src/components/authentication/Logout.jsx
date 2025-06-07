import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logoutAPI} from "../../api";

const Logout = ({ className, onClick }) => {
  const navigate = useNavigate();

const handleLogout = async () => {
  try {
    // ✅ Call the backend using centralized API function
    await logoutAPI();

    // ✅ Clear session and local storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    sessionStorage.setItem("hadSession", "false");

    // ✅ Redirect
    navigate("/");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
  return (
    <button
      onClick={() => {
        handleLogout();
        onClick && onClick();
      }}
      className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 ${className}`}
    >
      Logout
    </button>
  );
};

export default Logout;
