import { useState } from "react";

const useNotification = () => {
  const [notification, setNotification] = useState({ message: "", type: "" });

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  return { notification, showNotification };
};

export default useNotification;
