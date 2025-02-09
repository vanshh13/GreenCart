import React from "react";
import { useTheme } from "../configuration/CustomizableThemeConfiguration"; // Import from the correct file

const ThemeUpdater = () => {
  const { updateTheme } = useTheme();

  // Example: Update primary color dynamically
  React.useEffect(() => {
    updateTheme({
      primary: "#A0C878",
      secondary: "#27667B",
    });
  }, []);

  return null; // This component doesn’t render anything
};

export default ThemeUpdater;
