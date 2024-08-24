"use client";
import React, { useState } from "react";
import { registerUser } from "../firebase/register";
import { bloodgroups } from "../config/bloodGroups";

const RegisterForm = () => {
  const [userData, setUserData] = useState({
    bloodGroup: "",
    email: "",
    location: null,
    name: "",
    phone: "",
    type: "user",
    uid: "",
  });

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserData((prevState) => ({
            ...prevState,
            location: [latitude, longitude],
          }));
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerUser(userData);
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-xl rounded-lg p-8">
      <h1 className="text-4xl font-semibold text-teal-600 mb-6 text-center">
        Register User
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-teal-700">
            Name
          </label>
          <input
            type="text"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            className="block w-full mt-2 p-4 border border-teal-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:ring-opacity-50"
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-teal-700">
            Email
          </label>
          <input
            type="email"
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            className="block w-full mt-2 p-4 border border-teal-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:ring-opacity-50"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-teal-700">
            Phone
          </label>
          <input
            type="tel"
            value={userData.phone}
            onChange={(e) =>
              setUserData({ ...userData, phone: e.target.value })
            }
            className="block w-full mt-2 p-4 border border-teal-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:ring-opacity-50"
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-teal-700">
            Blood Group
          </label>
          <select
            value={userData.bloodGroup}
            onChange={(e) =>
              setUserData({ ...userData, bloodGroup: e.target.value })
            }
            className="block w-full mt-2 p-4 border border-teal-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:ring-opacity-50"
            required
          >
            <option value="" disabled>
              Select Blood Group
            </option>
            {bloodgroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-lg font-medium text-teal-700">
            Location
          </label>
          <button
            type="button"
            onClick={handleLocation}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-teal-500 to-turquoise-400 text-white rounded-lg shadow-lg hover:from-teal-600 hover:to-turquoise-500 focus:ring-teal-500 focus:ring-opacity-50 focus:outline-none"
          >
            Allow Location Access
          </button>
          {userData.location && (
            <p className="mt-2 text-teal-700">
              Location: {userData.location[0]}°, {userData.location[1]}°
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-4 px-6 bg-gradient-to-r from-teal-600 to-turquoise-500 text-white text-xl rounded-lg shadow-lg hover:from-teal-700 hover:to-turquoise-600 focus:outline-none focus:ring-4 focus:ring-teal-500"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
