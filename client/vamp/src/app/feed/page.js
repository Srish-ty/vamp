"use client";
import React, { useEffect, useState } from "react";
import { fetchPosts, fetchRequirements } from "../firebase/feed";

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const postData = await fetchPosts();
      setPosts(postData);
    };
    fetchData();
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <h1> {post.title} </h1>
          <h2> {post.authorDetails?.name || "Unknown"}</h2>
          <p>{post.content.join("\n")}</p>
          <small>
            posted on: {new Date(post.date.seconds * 1000).toLocaleDateString()}
          </small>
        </div>
      ))}
    </div>
  );
};

export default Posts;
