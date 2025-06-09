import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import DecorativePanel from "../ui/DecorativePanel";
import Notification from "../ui/notification/Notification";

const AuthPage = () => {
  const [currentPage, setCurrentPage] = useState("login");
  const [notification, setNotification] = useState({ message: "", show: false });

  const showNotification = (message) => {
    setNotification({ message, show: true });
    setTimeout(() => setNotification({ message: "", show: false }), 5000); // Hide after 5 sec
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-green-100">
      {/* Ensure Notification is the FIRST element inside the parent */}
      {notification.show && (
        <Notification message={notification.message} onClose={() => setNotification({ message: "", show: false })} />
      )}

      {/* Main content area: Stacks on mobile, side-by-side on larger screens */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Decorative Panel: Hidden on mobile, visible on medium screens and up */}
        <div className="relative w-full md:w-1/2 bg-green-600 hidden md:block">
          <DecorativePanel />
        </div>

        {/* Auth Forms Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-5">
          <div className="w-full max-w-md">
            <div className="flex justify-end space-x-3 mb-6"> {/* Added margin bottom */}
              <button
                onClick={() => setCurrentPage("login")}
                className={`px-4 py-2 rounded-md transition-colors ${
                  currentPage === "login" ? "text-green-600 font-semibold" : "text-gray-600 hover:text-green-600"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setCurrentPage("register")}
                className={`px-4 py-2 rounded-md transition-colors ${
                  currentPage === "register" ? "text-green-600 font-semibold" : "text-gray-600 hover:text-green-600"
                }`}
              >
                Register
              </button>
            </div>

            {currentPage === "login" ? (
              <Login onSwitchToRegister={() => setCurrentPage("register")} showNotification={showNotification} />
            ) : (
              <Register onSwitchToLogin={() => setCurrentPage("login")} showNotification={showNotification} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;