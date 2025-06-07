import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Leaf, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import SocialLogin from './SocialLogin';
import { registerUser } from "../../api";
import { useNavigate } from "react-router-dom";

const Register = ({ onSwitchToLogin, showNotification }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    UserName: "",
    UserEmail: "",
    Password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Password validation function
  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one capital letter");
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one digit");
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Check password strength when user types in password field
    if (name === "Password") {
      const errors = validatePassword(value);
      setPasswordError(errors.length > 0 ? errors.join(", ") : "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password before submission
    const passwordErrors = validatePassword(formData.Password);
    if (passwordErrors.length > 0) {
      setPasswordError(passwordErrors.join(", "));
      return;
    }
    
    if (formData.Password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    const user = {
      UserName: formData.UserName,
      UserEmail: formData.UserEmail,
      Password: formData.Password,
      UserType: "Customer",
    };
  
    try {
      const response = await registerUser(user);
      console.log("Register attempt with:", formData);
      
      showNotification("✅ Register successful!");
      setTimeout(() => {
        navigate("/authPage");
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error.response?.data?.message || error.message);
      
      // Show error message to the user
      alert(error.response?.data?.message || "❌ Registration failed. Please try again.");
    }
  };
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-0">
        <div className="flex items-center justify-center mb-4">
          <Leaf className="h-12 w-12 text-green-600" />
        </div>
        <CardTitle className="text-2xl text-center text-green-800">Create Account</CardTitle>
        <CardDescription className="text-center">
          Join GreenCart for organic products
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-1">
          
          {/* UserName Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">User Name</label>
            <div className="relative">
              <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Enter your name"
                name="UserName"
                value={formData.UserName}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                type="email"
                placeholder="Enter your email"
                name="UserEmail"
                value={formData.UserEmail}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                name="Password"
                value={formData.Password}
                onChange={handleChange}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {passwordError && (
              <p className="text-xs text-red-500 mt-1">{passwordError}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 6 characters long and contain at least one capital letter, 
              one digit, and one special character.
            </p>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {formData.confirmPassword && formData.Password !== formData.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
            Create Account
          </Button>
        </form>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button onClick={onSwitchToLogin} className="text-green-600 hover:text-green-500">
            Sign in
          </button>
        </p>
      </CardFooter>
      <SocialLogin />
    </Card>
  );
};

export default Register;