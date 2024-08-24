"use client";
import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config"; // Ensure correct path to your Firebase config
import Modal from "react-modal";

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [city, setCity] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = doc(db, "users", "V9re25KpNWqQYhIGUGfn"); // Replace with dynamic user ID if needed
      const docSnap = await getDoc(userDoc);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);

        // Fetch city name using coordinates
        if (data.location && data.location.length === 2) {
          const cityName = await getCityFromCoordinates(
            data.location[0],
            data.location[1]
          );
          setCity(cityName);
        }
      }
    };

    fetchUserData();
  }, []);

  const getCityFromCoordinates = async (lat, lng) => {
    const response = await fetch(`https://geocode.xyz/${lat},${lng}?json=1`);
    const data = await response.json();
    return data.city;
  };

  const handleEdit = () => {
    setEditedData(userData);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const userDoc = doc(db, "users", "V9re25KpNWqQYhIGUGfn"); // Replace with dynamic user ID if needed
    await updateDoc(userDoc, editedData);
    setUserData(editedData);
    setIsModalOpen(false);
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Header Section */}
      <div className="relative w-full max-w-5xl bg-white shadow-lg mt-8">
        <div className="w-full h-60 bg-gradient-to-b from-gray-800 to-gray-600"></div>
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <img
            src="https://via.placeholder.com/120" // Replace with actual image
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white"
          />
          <h2 className="mt-2 text-2xl font-bold">{userData.name}</h2>
          <p className="text-lg text-gray-500">{city}</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-full max-w-5xl mt-20 flex justify-around bg-white py-6 shadow-lg">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">{userData.karma}</span>
          <span className="text-lg text-gray-500">Karma Tokens</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">{userData.activity.length}</span>
          <span className="text-lg text-gray-500">Donation Count</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-5xl flex justify-around bg-white py-6 mt-6 shadow-lg">
        <button
          className="bg-red-500 text-white py-3 px-8 rounded-full text-lg"
          onClick={handleEdit}
        >
          Edit Profile
        </button>
        <button className="bg-gray-300 text-black py-3 px-8 rounded-full text-lg">
          Add Friends
        </button>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
          {/* Input Fields */}
          <input
            type="text"
            className="w-full p-2 mb-4 border"
            value={editedData.name}
            onChange={(e) =>
              setEditedData({ ...editedData, name: e.target.value })
            }
            placeholder="Name"
          />
          <input
            type="email"
            className="w-full p-2 mb-4 border"
            value={editedData.email}
            onChange={(e) =>
              setEditedData({ ...editedData, email: e.target.value })
            }
            placeholder="Email"
          />
          <input
            type="text"
            className="w-full p-2 mb-4 border"
            value={editedData.phone}
            onChange={(e) =>
              setEditedData({ ...editedData, phone: e.target.value })
            }
            placeholder="Phone"
          />
          {/* Additional Fields */}
          {/* Save Button */}
          <button
            className="bg-red-500 text-white py-3 px-8 rounded-full text-lg"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </Modal>

      {/* Photo Grid */}
      {/* Other Components */}
    </div>
  );
}

export default ProfilePage;
