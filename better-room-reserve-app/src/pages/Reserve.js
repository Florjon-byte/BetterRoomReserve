import 'bootstrap/dist/css/bootstrap.css';
import Papa from "papaparse";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../cssfiles/reserve.css";
import calendar from "../images/calendar.png";
import forth from "../images/forthfloor.png";
import third from "../images/thirdfloor.png";
import { getToken, setToken } from "../token"

/*

what darrien wants:
    - calender setup 

- set up endpoints to work with reserve page 
- set up profile 


*/

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

    const [selectedDate, setSelectedDate] = useState(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);


    const generateButtonTimes = (start_time = "8:00 AM") => {
        const button_times = []
        const i = times.findIndex((start) => start === start_time)
        for(let index = i; index < times.length - 2; index++){
            button_times.push(`${times[index]} - ${times[index+1]}`)
        }

        return button_times
    }

    const createTimeButtons = (start_time = "8:00 AM") => {
        return ( generateButtonTimes(start_time).map(time => (
            <button className='timebuttons'>{time}</button>
        )) )
    }

    const [selected, setSelected] = useState([]);

    const toggle = (time) => {
        if(selected.includes(time)) {
          setSelected(selected.filter(b => b !== time))
        } else {
          setSelected([...selected, time]);
        }
    }

    const getCurrentDate = () => {
        const date = new Date().toISOString().split('T')[0]
        return date
    }

    const getTwoMonthsAfter = () => { 
        const today = new Date()
        const two_months_later = new Date(
            today.getFullYear(),
            today.getMonth() + 2,
            today.getDay()
        )

        return two_months_later.toISOString().split('T')[0]
    }

    const findReservationTime = () => {
        selected.sort((a, b) => {
            const [startA] = a.split(' - '); 
            const [startB] = b.split(' - ');
            const timeA = new Date('1970/01/01 ' + startA);
            const timeB = new Date('1970/01/01 ' + startB);  
            return timeA - timeB;
        });

        let startDate = 0;
        let endDate = 0;
        let consecutive = true;

        let test_times = [] 
        selected.forEach(time => {
            const [start, end] = time.split(' - ');
            const [start_hr_min, start_ampm] = start.split(" ")
            let [start_hr, start_min] = start_hr_min.split(":")

            const [end_hr_min, end_ampm] = end.split(" ")
            let [end_hr, end_min] = end_hr_min.split(":")

            start_hr = parseInt(start_hr)
            end_hr = parseInt(end_hr)
            start_min = parseInt(start_min)
            end_min = parseInt(end_min)
        
            if(start_ampm === "PM" && start_hr !== 12){
                start_hr += 12 
            } 
            if (end_ampm === "PM" && end_hr !== 12) {
                end_hr += 12 
            }

            test_times.push([start_hr, start_min], [end_hr, end_min])
        })

        for(let index = 1; index < test_times.length; index += 2){
            if(test_times.length - 1 !== index){

                // compare test_times[index] and test_times[index+2] 
                // test_times[inde+2] - test_times[index] === 30 mins ; otherwise not consecutive 
                if ( test_times[index+2][0] - test_times[index][0] > 1 || (test_times[index+2][0] - test_times[index][0] === 1) &&
                Math.abs(test_times[index+2][1] - test_times[index][1]) !== 30){
                    consecutive = false;
                }
            }
        }

        if ( selected.length === 0){
            console.log("EMPTY RESERVATION")
        } else if(!consecutive){ // if false 
            console.log("ERROR", selected)
        } else if (consecutive){ 
            console.log("GOOD", selected)
        } 
    }

    const [floor, setFloor] = useState("3") // for changing floor levels and maps

    const handleLoginClick = () => { 
        navigate("/login")
    }

    const handleLogoutClick = () => {
        setToken(null)
        navigate("/")
      }

    // made to make buttons not defualt to refreshing the page without an href 
    const handleSubmit = (e) => {
        e.preventDefault();
      }

    const changeFloors = () => {
        setFloor(floor => floor === "3" ? "4" : "3");
    }

    // APIS GO HERE 
    const handleFilter = async (event) => {
        event.preventDefault()


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
                        <a class="nav-link" href="/reserve">Reserve</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/profile">Profile</a>
                    </li>
                    </ul>
                </div>
                {!getToken() && <button class="btn primary btn" onClick={handleLoginClick}>
                    Login
                </button>}
                {getToken() && <button class="btn primary btn" onClick={handleLogoutClick}>
                    Logout
                </button>}
                </div>
            </nav>

            {/* Reserve */}

            {/* Filters */}
            <section class="filter">
                <h3>Filters:</h3>
                <form className='select' onSubmit={handleFilter}>
                    <div className='size'>
                        <label>Size:</label>
                        <select className='dropdown'>
                        <option selected=""></option>
                            {size.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Noise is being deprecated */}
                    {/* <div className='noise'>
                        <label>Noise Level:</label>
                        <select className='dropdown'> 
                        <option selected=""></option>
                            {noise.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div> */}
                    <div className="dates">
                        <label>Date:</label>
                        <input className='dropdown' type='date' min={getCurrentDate()}
                        max={getTwoMonthsAfter()}/>
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
                        onClick={() => changeFloors()}> ▲ </button>
                        <button className="coolButton"
                        onClick={() => changeFloors()}> ▼ </button>
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
                            <img className='forth' src={forth} width="750" height="560" 
                            usemap="#forthFloor"></img>
                            <map name="forthFloor">
                                <area shape="rect" coords="229,13,292,49"   href="#" />
                                <area shape="rect" coords="230,53,292,86"   href="#" />
                                <area shape="rect" coords="230,88,293,122"  href="#" />
                                <area shape="rect" coords="229,126,292,176" href="#" />
                                <area shape="rect" coords="347,306,367,325" href="#" />
                                <area shape="rect" coords="369,305,387,323" href="#" />
                                <area shape="rect" coords="390,307,407,324" href="#" />
                                <area shape="rect" coords="348,328,366,345" href="#" />
                                <area shape="rect" coords="369,329,387,345" href="#" />
                                <area shape="rect" coords="390,328,407,345" href="#" />
                                <area shape="rect" coords="348,348,367,364" href="#" />
                                <area shape="rect" coords="389,348,407,364" href="#" />
                                <area shape="rect" coords="444,329,480,363" href="#" />
                                <area shape="rect" coords="483,331,519,363" href="#" />
                                <area shape="rect" coords="552,307,570,324" href="#" />
                                <area shape="rect" coords="573,307,592,324" href="#" />
                                <area shape="rect" coords="593,307,611,324" href="#" />
                                <area shape="rect" coords="614,306,631,324" href="#" />
                                <area shape="rect" coords="634,306,653,323" href="#" />
                                <area shape="rect" coords="552,327,570,344" href="#" />
                                <area shape="rect" coords="574,328,589,343" href="#" />
                                <area shape="rect" coords="595,327,610,342" href="#" />
                                <area shape="rect" coords="615,328,631,344" href="#" />
                                <area shape="rect" coords="634,327,653,344" href="#" />
                                <area shape="rect" coords="553,348,570,366" href="#" />
                                <area shape="rect" coords="634,348,652,364" href="#" />
                            </map>
                        </div>}
                    </div>

                    <div className="times"> 
                        <label>Available Times</label>
                        <form onSubmit={handleSubmit}>
                            {generateButtonTimes("8:00 AM").map(time => (
                                <button onClick={() => {toggle(time)}} 
                                className={selected.includes(time) ? "selected" : "timebuttons"}
                                >{time}
                                </button>
                            ))}
                        </form>
                    </div>
                </section>
            </section>

            <section className='times_selected'>
                <button className='coolButton' onClick={() => {findReservationTime()}}>Reserve</button>
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