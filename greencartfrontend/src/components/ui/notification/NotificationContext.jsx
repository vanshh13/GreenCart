import React, { createContext, useState, useEffect } from "react";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [latestNotification, setLatestNotification] = useState(null);
  const [showPanel, setShowPanel] = useState(false);

  // Load stored notifications from localStorage
  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
    setNotifications(storedNotifications);
  }, []);

  // Function to add new notification
  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
      timestamp: new Date().toLocaleString(),
    };
    setNotifications((prev) => {
      const updatedNotifications = [newNotification, ...prev];
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications)); // Save in localStorage
      return updatedNotifications;
    });
    setLatestNotification(newNotification);

    // Hide the notification after 7 seconds
    setTimeout(() => setLatestNotification(null), 7000);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, showPanel, setShowPanel }}>
      {children}
      {latestNotification && (
        <div
          onClick={() => setShowPanel(true)}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-full shadow-md cursor-pointer"
        >
          {latestNotification.message}
        </div>
      )}
      {showPanel && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-96 p-5 rounded-lg shadow-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Notifications</h2>
              <button onClick={() => setShowPanel(false)} className="text-red-500 font-bold">X</button>
            </div>
            <ul className="mt-3 space-y-2">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <li key={notif.id} className="border-b py-2">
                    {notif.message} <span className="text-xs text-gray-500">({notif.timestamp})</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No notifications</p>
              )}
            </ul>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};
