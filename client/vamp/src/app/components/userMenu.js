"use client";

import { Avatar, Menu, MenuItem, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext } from "react";
import { useState } from "react";
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
          sx={{ width: 24, height: 24, marginLeft: "5px" }}
        />
      </Box>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem>
          {" "}
          <a href="/dashboard">Profile</a>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          {" "}
          <a href="/login">Logout</a>{" "}
        </MenuItem>
      </Menu>
    </div>
  );
};

export default UserMenu;
