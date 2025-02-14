import React, { useState } from 'react';
import { Camera, Save } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import Logout from '../components/authentication/Logout';

const UserProfile = () => {
  const [profileData, setProfileData] = useState({
    image: '/api/placeholder/150/150',
    name: '',
    email: '',
    contact: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e, field, isAddress = false) => {
    if (isAddress) {
      setProfileData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: e.target.value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: e.target.value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle profile update
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Profile Image Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <img
                  src={profileData.image}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                />
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer">
                  <Camera className="h-5 w-5 text-gray-600" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleInputChange(e, 'name')}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange(e, 'email')}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={profileData.contact}
                  onChange={(e) => handleInputChange(e, 'contact')}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street/Society Name
                  </label>
                  <input
                    type="text"
                    value={profileData.address.street}
                    onChange={(e) => handleInputChange(e, 'street', true)}
                    disabled={!isEditing}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City/Village
                  </label>
                  <input
                    type="text"
                    value={profileData.address.city}
                    onChange={(e) => handleInputChange(e, 'city', true)}
                    disabled={!isEditing}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={profileData.address.state}
                    onChange={(e) => handleInputChange(e, 'state', true)}
                    disabled={!isEditing}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={profileData.address.pincode}
                    onChange={(e) => handleInputChange(e, 'pincode', true)}
                    disabled={!isEditing}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      <Logout/> 
    </div>
  );
};

export default UserProfile;