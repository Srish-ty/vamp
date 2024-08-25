"use client";

import { Avatar, Menu, MenuItem, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { auth } from "../firebase/config";

const UserMenu = () => {
  const { user, type } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleLogout = () => {
    auth.signOut();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  return (
    <div>
      <Box
        sx={{ display: "flex", "&:hover": { cursor: "pointer" } }}
        onClick={handleClick}
      >
        <div>
          <Typography>{user.email || "Status code 0"}</Typography>{" "}
        </div>
        <Avatar
          alt="avatar"
          src={
            "https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png"
          }
          sx={{ width: 40, height: 40, marginLeft: "5px" }} // Increase size here
        />
      </Box>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            width: "200px", // Increase width
            height: "auto", // Adjust height if needed
            padding: "10px", // Add padding inside the menu
          },
        }}
      >
        <MenuItem sx={{ padding: "10px 20px" }}>
          <a
            href="/dashboard"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Profile
          </a>
        </MenuItem>{" "}
        <MenuItem onClick={handleLogout} sx={{ padding: "10px 20px" }}>
          <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
            Logout{" "}
          </a>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default UserMenu;
