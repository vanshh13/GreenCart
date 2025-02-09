import React from "react";
import { Button } from "../ui/Button";
import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";

const SocialLogin = () => {
  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // Integrate with OAuth, Firebase, or backend authentication here
  };

  return (
    <div className="flex flex-col space-y-2">
      <Button
        className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-2"
        onClick={() => handleSocialLogin("Google")}
      >
        <FaGoogle size={24} className="mr-3" />
        Continue with Google
      </Button>

      <Button
        className="w-full flex items-center justify-center bg-blue-700 hover:bg-blue-700 text-white py-2"
        onClick={() => handleSocialLogin("Facebook")}
      >
        <FaFacebook size={24} className="mr-3" />
        Continue with Facebook
      </Button>
    </div>
  );
};

export default SocialLogin;
