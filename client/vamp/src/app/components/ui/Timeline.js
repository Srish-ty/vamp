import React from "react";
import { format } from "date-fns"; // Optional: for date formatting

const Timeline = ({ donations }) => {
  return (
    <div className="mt-6">
      <h3 className="text-2xl font-bold mb-4">Donation History</h3>
      <div className="space-y-4">
        {donations.map((donation, index) => {
          const date = donation.toDate(); // Convert Firestore Timestamp to JS Date
          const formattedDate = format(date, "MMMM d, yyyy"); // Format the date (optional)

          return (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-gray-700 font-semibold">Hospital Name </p>
              <p className="text-gray-500">{formattedDate}</p>{" "}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
