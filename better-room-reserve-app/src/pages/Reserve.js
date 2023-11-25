import 'bootstrap/dist/css/bootstrap.css';
import third from "../images/thirdfloor.png"
import forth from "../images/forthfloor.png"
import "../cssfiles/reserve.css"
import React, { Component, useEffect, useState, Route } from "react"
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import Papa from "papaparse"

function runSize(){
    let filePath = "Rooms.csv"
    let result = new Set() 

    Papa.parse(filePath, {
        complete: function(results) {
        results.data.forEach(row => {
            // process each row
            console.log(row.data)
        });
        }
    });
}


export function Reserve(){
    const navigate = useNavigate()
    const size = ["Individual (1)", "Medium (5)", "Large (8)"]
    const noise = ["Low", "Medium", "High"]
    const times = Array.from({length: 13}, (_, i) => i + 8)
    .flatMap(hour => {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12; 
        return ["00", "30"].map(min => `${hour}:${min} ${ampm}`);
    })

    const [floor, setFloor] = useState("3") // for changing floor levels and maps

    const handleLoginClick = () => { 
        navigate("/login")
    }

    const changeFloors = () => {
        setFloor(floor => floor === "3" ? "4" : "3");
    }


    return (
        <div> 
            {/* Navbar */}
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                <a class="navbar-brand"> BetterRoomReserve </a>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="/">Home</a>
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

            {/* Reserve */}

            {/* Filters */}
            <section class="filter">
                <h3>Filters:</h3>
                <form className='select' method='POST'>
                    <div className='size'>
                        <label>Size:</label>
                        <select className='dropdown' selected="--">
                        <option selected=""></option>
                            {size.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='noise'>
                        <label>Noise Level:</label>
                        <select className='dropdown' selected="--"> 
                        <option selected=""></option>
                            {noise.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='times'>
                        <label>Time Start:</label>
                        <select className='dropdown'>
                            <option selected=""></option>
                            {times.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type='submit' className='coolButton'> Apply </button>
                </form>
            </section>

            {/* Floor Map */}   
            <section className="reservation">

                <section className="reservation_service">
                    <div className="floorbuttons"> 
                        <button className="coolButton" style={{ marginBottom: "15%"}}
                        onClick={() => changeFloors()}> Up </button>
                        <button className="coolButton"
                        onClick={() => changeFloors()}> Down </button>
                    </div>
                    <div className='floormap'>
                        <lable> Floor: {floor}</lable>
                        {floor === "3" &&
                        <div className='thirdfloor'> 
                            <img className='thirdFloorMap' src={third} width="750" height="530"
                            usemap="#thirdFloor"/>
                            <map name="thirdFloor">
                                <area shape="rect" alt="hello" coords="317,277,354,315" href="#" />
                                <area shape="rect" coords="316,315,353,353" href="#" />
                                <area shape="rect" coords="355,315,391,355" href="#" />
                                <area shape="rect" coords="355,276,391,314" href="#" />
                                <area shape="rect" coords="619,212,651,245" href="#" />
                                <area shape="rect" coords="551,210,583,245" href="#" />
                                <area shape="rect" coords="585,211,617,246" href="#" />
                                <area shape="rect" coords="550,277,583,312" href="#" />
                                <area shape="rect" coords="585,277,617,312" href="#" />
                                <area shape="rect" coords="617,277,648,311" href="#" />
                                <area shape="rect" coords="550,315,583,349" href="#" />
                                <area shape="rect" coords="586,315,615,349" href="#" />
                                <area shape="rect" coords="618,315,649,358" href="#" />
                                <area shape="rect" coords="213,377,249,416" href="#" />
                                <area shape="rect" coords="252,378,288,416" href="#" />
                            </map>

                        </div>}

                        {floor === "4" && 
                        <div className='forthfloor'>
                            <img className='forth' src={forth} width="750" height="600" 
                            useMap='#forth'></img>
                        </div>}
                    </div>

                    <div className="times"> 

                    </div>
                </section>

            </section>

            <section className='times_selected'>

            </section>

            {/* Footer */}
            <footer className="bg-dark text-center text-white"> 
                <div className="footer-text">
                © 2023 Copyright: BetterRoomReserve 
                </div>
            </footer>
        </div>
    )
}