import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Leaf, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import SocialLogin from './SocialLogin';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    UserName: "",
    UserEmail: "",
    Password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.Password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Register attempt with:", formData);
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
