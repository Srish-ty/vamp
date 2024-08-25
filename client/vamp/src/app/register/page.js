"use client";
import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import UserForm from "./userReg";
import RegisterHospital from "./hospReg";
import LabRegistrationForm from "./labReg";
import { AuthContext } from "../context/authContext";
import { Route } from "@mui/icons-material";

const RegisterPage = () => {
  const { user, type } = useContext(AuthContext);
  console.log("User from context: ", user);
  console.log("Type from context: ", type);

  const renderForm = () => {
    const router = useRouter();

    if (!type) {
      router.push("/login");
    }
    return (
      <div>
        {type == "User" ? (
          <UserForm />
        ) : type == "Hospital" ? (
          <RegisterHospital />
        ) : type == "Lab" ? (
          <LabRegistrationForm />
        ) : (
          <p>Invalid type. Please log in with the correct user type.</p>
        )}
      </div>
    );
  };

  return <div>{renderForm()}</div>;
};

export default RegisterPage;
