"use client";
import React, { useState } from "react";
import { registerLab } from "../firebase/register";
import { bloodgroups } from "../config/bloodGroups";

const LabRegistrationForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodInventory, setBloodInventory] = useState([
    { bloodType: "", quantity: "" },
  ]);
  const [location, setLocation] = useState(null);

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const addBloodInventory = () => {
    setBloodInventory([...bloodInventory, { bloodType: "", quantity: "" }]);
  };

  const handleInventoryChange = (index, field, value) => {
    const updatedInventory = [...bloodInventory];
    updatedInventory[index][field] = value;
    setBloodInventory(updatedInventory);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const labData = {
      name,
      email,
      phone,
      location: new window.firebase.firestore.GeoPoint(
        location.lat,
        location.lng
      ),
      blood_inventory: bloodInventory.reduce((acc, item) => {
        acc[item.bloodType] = item.quantity;
        return acc;
      }, {}),
    };

    try {
      await registerLab(labData);
      alert("Lab registered successfully!");
    } catch (error) {
      console.error("Error registering lab:", error);
    }
  };

  return (
    <div className="bg-teal-100 min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md max-w-md w-full"
      >
        <h1 className="text-teal-600 text-xl font-bold mb-4">
          Register Blood Lab
        </h1>

        <div className="mb-4">
          <label className="block text-teal-700">Name</label>
          <input
            type="text"
            className="w-full p-2 border border-teal-400 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-teal-700">Email</label>
          <input
            type="email"
            className="w-full p-2 border border-teal-400 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-teal-700">Phone</label>
          <input
            type="text"
            className="w-full p-2 border border-teal-400 rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-teal-700">Blood Inventory</label>
          {bloodInventory.map((item, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <select
                className="w-1/2 p-2 border border-teal-400 rounded"
                value={item.bloodType}
                onChange={(e) =>
                  handleInventoryChange(index, "bloodType", e.target.value)
                }
                required
              >
                <option value="">Select Blood Type</option>
                {bloodgroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
              <input
                type="number"
                className="w-1/2 p-2 border border-teal-400 rounded"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) =>
                  handleInventoryChange(index, "quantity", e.target.value)
                }
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addBloodInventory}
            className="text-teal-700 underline"
          >
            Add More
          </button>
        </div>

        <div className="mb-4">
          <button
            type="button"
            onClick={handleLocation}
            className="bg-teal-500 text-white py-2 px-4 rounded"
          >
            Allow Location
          </button>
          {location && (
            <div className="mt-2 text-teal-600">
              Location: {location.lat.toFixed(2)}, {location.lng.toFixed(2)}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700"
        >
          Register Lab
        </button>
      </form>
    </div>
  );
};

export default LabRegistrationForm;
