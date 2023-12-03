import 'bootstrap/dist/css/bootstrap.css';
import React, { Component, useEffect, useState, Route } from "react"
import { useNavigate } from 'react-router-dom'
import axios from "axios"

export function Profile(){
    const navigate = useNavigate()

    const handleLoginClick = () => { 
        navigate("/login")
    }
    
    return(
        <div> 
            {/* Navbar */}
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                <a class="navbar-brand"> BetterRoomReserve </a>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="/">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/profile">Profile</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/reserve">Reserve</a>
                    </li>
                    </ul>
                </div>
                <button class="btn primary btn" onClick={handleLoginClick}>
                    Login
                </button>
                </div>
            </nav>

            {/* Profile */}

            {/* Footer */}
            <footer className="bg-dark text-center text-white"> 
                <div className="footer-text">
                © 2023 Copyright: BetterRoomReserve 
                </div>
            </footer>
        </div>
    )
}