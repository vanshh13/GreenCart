import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = ({ className, onClick }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");

      // ✅ Call the backend to invalidate the token (optional)
      await axios.post("http://localhost:5000/api/users/logout", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // ✅ Clear session storage and local storage
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      sessionStorage.setItem("hadSession", "false");

      // ✅ Redirect to home page
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
