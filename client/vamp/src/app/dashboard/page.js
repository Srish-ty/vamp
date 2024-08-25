"use client";

import React, { useState, useEffect, useContext } from "react";
import { collection, query, where, getDocs } from "firebase/firestore"; // Import Firestore functions
import { db } from "../firebase/config"; // Import your Firebase config
import ProfileHeader from "../components/ui/ProfileHeader";
import Timeline from "../components/ui/Timeline";
import KarmaCard from "../components/ui/KarmaCard";
import ModalDialog from "../components/ui/ModalDialog";
import { AuthContext } from "../context/authContext";

const ProfilePage = () => {
  const { user: authUser, type } = useContext(AuthContext); // Use authUser to avoid conflicts
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const uidQuery = query(
          collection(db, "users"),
          where("uid", "==", authUser.uid)
        );

        const emailQuery = query(
          collection(db, "users"),
          where("email", "==", authUser.email)
        );

        // Execute both queries
        const [uidSnapshot, emailSnapshot] = await Promise.all([
          getDocs(uidQuery),
          getDocs(emailQuery),
        ]);

        // Combine the results (prefer uid match if both exist)
        let foundUser = null;
        if (!uidSnapshot.empty) {
          foundUser = uidSnapshot.docs[0].data(); // Take the first document found
        } else if (!emailSnapshot.empty) {
          foundUser = emailSnapshot.docs[0].data(); // Take the first document found
        }

        if (foundUser) {
          setUserData(foundUser);
        } else {
          console.error("No matching user found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (authUser) {
      fetchUserData();
    }
  }, [authUser]);

  const handleHelpClick = () => {
    setIsModalOpen(true);
  };

  const handleAnswer = (answer) => {
    console.log("User answer:", answer);
    setIsModalOpen(false);
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div>
        <ProfileHeader user={userData} />
      </div>
      <div className="flex mt-6 space-x-6">
        <div className="w-2/3 max-h-3/5 bg-slate-200 p-3 rounded-xl">
          <Timeline donations={userData.activity || []} />
        </div>
        <div className="w-1/3">
          {userData.type === "User" && (
            <KarmaCard
              karmaPoints={
                userData.karma > 0 ? userData.karma : userData.activity?.length
              }
              onHelpClick={handleHelpClick}
            />
          )}
        </div>
      </div>
      <ModalDialog
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onAnswer={handleAnswer}
      />
    </div>
  );
};

export default ProfilePage;
