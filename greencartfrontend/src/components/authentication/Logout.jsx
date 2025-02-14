import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
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
      navigate("/home");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
      Logout
    </button>
  );
};

export default Logout;
