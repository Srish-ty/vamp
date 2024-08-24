"use client";
import React, { useEffect, useState } from "react";
import { fetchPosts, fetchRequirements } from "../firebase/feed";
import { bloodgroups } from "../config/bloodGroups";

const Feed = () => {
  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const postData = await fetchPosts();
      const reqData = await fetchRequirements();

      // Add a 'type' field to differentiate between posts and requirements
      const combined = [
        ...postData.map((post) => ({ ...post, type: "Post" })),
        ...reqData.map((req) => ({ ...req, type: "Requirement" })),
      ];

      // Sort by date (most recent first)
      combined.sort((a, b) => {
        const dateA = a.date || a.postDate;
        const dateB = b.date || b.postDate;
        return dateB.seconds - dateA.seconds;
      });

      setCombinedData(combined);
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Feed</h1>
      {combinedData.map((item) => (
        <div
          key={item.id}
          className="border rounded-lg p-4 mb-4 bg-white shadow-md"
        >
          <h2 className="text-xl font-semibold text-gray-800">
            {item.title || "Blood Requirement"}
          </h2>
          <p className="text-sm text-gray-500 mb-2">
            Type: <span className="font-bold">{item.type}</span>
          </p>

          {/* If it's a post */}
          {item.type === "Post" && (
            <>
              <h3 className="text-md font-medium text-gray-700">
                Author: {item.authorDetails?.name || "Unknown"}
              </h3>
              {item.content.map((para, index) => (
                <p key={index} className="text-gray-700 mb-2">
                  {para}
                </p>
              ))}
            </>
          )}

          {/* If it's a requirement */}
          {item.type === "Requirement" && (
            <>
              <h3 className="text-md font-medium text-gray-700">
                Hospital: {item.hospitalDetails?.name || "Unknown"}
              </h3>
              {bloodgroups.map(
                (grp) =>
                  item.demand[grp] && (
                    <p key={grp} className="text-gray-700 mb-2">
                      {grp}: {item.demand[grp]}
                    </p>
                  )
              )}
            </>
          )}

          <small className="text-gray-500">
            {item.type === "Post" ? (
              <span>
                Posted on:
                {new Date(item.date.seconds * 1000).toLocaleDateString()}
              </span>
            ) : (
              <>
                <span>
                  Posted on:
                  {new Date(item.postDate.seconds * 1000).toLocaleDateString()}
                </span>
                <br />
                <span>
                  Last Date:
                  {new Date(item.lastDate.seconds * 1000).toLocaleDateString()}
                </span>
              </>
            )}
          </small>
        </div>
      ))}
    </div>
  );
};

export default Feed;
