"use client";
import React, { useContext } from "react";
import UserForm from "./userReg";
import RegisterHospital from "./hospReg";
import LabRegistrationForm from "./labReg";
import { AuthContext, AuthProvider } from "../context/authContext";

const RegisterPage = () => {
  // Access context directly
  const { type } = useContext(AuthContext); // Get the type from AuthContext

  // Conditionally render the form based on the user type
  const renderForm = () => {
    return (
      <div>
        {type == "user" ? (
          <UserForm />
        ) : type == "hospital" ? (
          <RegisterHospital />
        ) : type == "lab" ? (
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
