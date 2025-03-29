import React from "react";
import "./header.css";
import { Link } from "react-router-dom";
import TurtleLogo from "./assets/TurtleLogo2.png";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import WebsiteLogo from "./WebsiteLogo";
import NavLinks from "./NavLinks";


function Header() {
    return (
        <div className="header">
            <WebsiteLogo />
            
            <h1 className="title">MTurtleBase</h1>
            
            <div className="right-group">
                <div className="search-container">
                    <TextField
                        id="search-field"
                        placeholder="Search..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        variant="standard"
                        fullWidth
                    />
                </div>
                <NavLinks />
            </div>
        </div>
    );
}

export default Header;