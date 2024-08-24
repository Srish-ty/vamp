"use client";
import React, { useEffect, useState } from "react";
import { fetchPosts, fetchRequirements } from "../firebase/feed";
import FeedCard from "../components/feedcard"; // Import FeedCard component

const Feed = () => {
  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const postData = await fetchPosts();
      const reqData = await fetchRequirements();

      const combined = [
        ...postData.map((post) => ({ ...post, type: "Post" })),
        ...reqData.map((req) => ({ ...req, type: "Requirement" })),
      ];

      combined.sort((a, b) => {
        const dateA = a.date || a.postDate;
        const dateB = b.date || a.postDate;
        return dateB.seconds - dateA.seconds;
      });

      setCombinedData(combined);
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gradient-to-r from-white to-teal-200">
      <div className="relative max-w-4xl  mx-auto p-4">
        <h1 className="text-3xl font-bold text-Black mb-8 ">Community Feed</h1>
        {combinedData.map((item) => (
          <FeedCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
