import 'bootstrap/dist/css/bootstrap.css';
import Papa from "papaparse";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../cssfiles/reserve.css";
import calendar from "../images/calendar.png";
import forth from "../images/forthfloor.png";
import third from "../images/thirdfloor.png";

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
    const generated_button_times = times.slice(0, -2)
    const [roomhours, setRoomHours] = useState([])


    // 
    const [selectedSize, setSelectedSize] = useState(5)
    const [selected, setSelected] = useState([]);
    const [filters, setFilters] = useState(false)
    const [timesShown, setTimeShown] = useState(false)

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

    const [selectedDate, setSelectedDate] = useState(getCurrentDate())


    const getTwoMonthsAfter = () => { 
        const today = new Date()
        const two_months_later = new Date(
            today.getFullYear(),
            today.getMonth() + 2,
            today.getDay()
        )

        return two_months_later.toISOString().split('T')[0]
    }

    const getCurrentTime = (type) => {
        const date = new Date()
        const coeff = 1000 * 60 * 30
        return new Date(Math.round(date.getTime() / coeff) * coeff).toLocaleTimeString(type, {hour: '2-digit', minute:'2-digit'});
    }

    // make this either current time or if not in currnet time, make it 8 am 
    const [selectedStartTime, setSelectedStartTime] = useState(getCurrentTime("en-GB"))

    const generateButtonTimes = () => {
        for(let index = 0; index < time12hr.length - 1; index++){
            if(index === -1){ break }
            roomhours.push(`${time12hr[index]} - ${time12hr[index+1]}`)
        }

        return roomhours
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
        localStorage.clear()
        navigate("/")
      }

    // made to make buttons not defualt to refreshing the page without an href 
    const handleSubmit = (e) => {
        e.preventDefault();
      }

    const changeFloors = () => {
        setFloor(floor => floor === "3" ? "4" : "3");
    }

    const convertTo12Hour = (time) => {

        let [hours, minutes] = time.split(':');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12; // convert 0 to 12
        
        return `${hours}:${minutes} ${ampm}`;
      }
    
    const [listOfRooms, setListOfRooms] = useState([[],[]])

    // APIS GO HERE 
    const [ObjOfRooms, setObjOfRooms] = useState({}) 
    const handleFilter = async (event) => {
        event.preventDefault()
        try {
            const endpoint = "http://localhost:8000/reserve/filter"
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                  size: selectedSize,
                  date: selectedDate,
                  start_time: selectedStartTime // 24 hour format 
                }),
            });
            const data = await response.json();
            setObjOfRooms(data)

        } catch (error) {
            console.log(error)
        }

        // console.log(listOfRooms)
        let thirdfloor = []
        let forthfloor = [] 
        let list_of_rooms = Object.entries(ObjOfRooms)
        for(let index = 0; index < list_of_rooms.length; index++){
            if(list_of_rooms[index][1] === "3") { thirdfloor.push(list_of_rooms[index][0])}
            else{ forthfloor.push(list_of_rooms[index][0])}
        }

        setListOfRooms([thirdfloor, forthfloor])
        if(listOfRooms[0].length >= 1 || listOfRooms[1].length >= 1){ setFilters(true) }

    }

    const [roomId, setRoomId] = useState()
    const [buttonList, setButtonList] = useState([])

    const handleAreaClick = async (event) => {
        event.preventDefault()
        if(!localStorage.getItem("token")) { navigate("/login") }

        try{ 
            const endpoint = "http://localhost:8000/reserve/room-time"
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    room_id: document.activeElement.id,
                    time: selectedStartTime,
                    date: selectedDate,
                    building: "Dibner"
                })
            })
            const data = await response.json();
            let times = Object.values(data)[0]
            console.log("API Times: ", times)
            let time12hr = []
            times.forEach(time => {
                time12hr.push(convertTo12Hour(time.slice(0,-3)))
            })
            
            let list = []
            for(let index = 0; index < time12hr.length - 1; index++){
                if(index === -1){ break }
                list.push(`${time12hr[index]} - ${time12hr[index+1]}`)
            }
            console.log("Final Button Times: ", list)

            setRoomHours(list)

            let button_list = roomhours.map(time => (
                <button onClick={() => {toggle(time)}} 
                className={selected.includes(time) ? "selected" : "timebuttons"}
                >{time}
                </button>
            ))
            console.log("Button List", button_list)
            
        } catch (error) {
            console.log(error)
        }
        setTimeShown(true)
    }

    const [roomInfo, setRoomInfo] = useState([])
    const [showInfo, setShowInfo] = useState(false)

    const handleMouseOver = async (event, id) => {
        event.preventDefault()
        try{
            const endpoint = "http://localhost:8000/reserve/room-info"
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    room_id: id,
                })
            })
            let data = await response.json()
            setRoomInfo(
               ["Whiteboard: " + `${data.whiteboard}`, "Monitor: " + `${data.monitor}\n`, "Outlets: " + `${data.outlets}\n`]
            )
            setShowInfo(true)
        } catch (error) {
            console.log(error)
        }
    }

    const handleMouseOut = () => {
        setShowInfo(false)
    }
    
    // date, roomid, times 
    const handleReserve = async (event) => {
        event.preventDefault()
        try{
            const endpoint = "http://localhost:8000/reserve"
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    room_id: id,
                })
            })
        } catch (error) {
            console.log(error)
        }
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
                {!localStorage.getItem("token") && <button class="btn primary btn" onClick={handleLoginClick}>
                    Login
                </button>}
                {localStorage.getItem("token") && <button class="btn primary btn" onClick={handleLogoutClick}>
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
                        <select className='dropdown' onChange={(event) =>{
                            setSelectedSize(parseInt(event.target.value[event.target.value.length - 2]))
                            setTimeShown(false)
                        }}>
                        <option selected=""></option>
                            {size.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="dates">
                        <label>Date:</label>
                        <input className='dropdown' type='date' min={getCurrentDate()}
                        max={getTwoMonthsAfter()} onChange={(event) => {
                            setSelectedDate(event.target.value)
                            setTimeShown(false)
                        }}/>
                    </div>
                    <div className='times'>
                        <label>Time Start:</label>
                        <select className='dropdown' onChange={(event) => { 
                            if(parseInt(event.target.value.slice(0,-6)) !== 12 && event.target.value.slice(-2) === "PM"){ 
                                let hour = parseInt(event.target.value.slice(0,-6)) + 12
                                let mins = event.target.value.slice(-5,-3) 
                                setSelectedStartTime(`${hour}:${mins}`)
                            } else {
                                if(event.target.value.slice(0,-6) < 10){
                                    setSelectedStartTime("0" + event.target.value.slice(0,-3))

                                }else{
                                    setSelectedStartTime(event.target.value.slice(0,-3))
                                }
                            }
                            setTimeShown(false)

                        }}>
                            <option selected=""></option>
                            {generated_button_times.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))
                            }
                        </select>
                    </div>

                    <button type='submit' className='coolButton'> Apply </button>
                </form>
            </section>

            {/* Filter Output */}
            {filters && <section className="filteroutput"> 
                <label> Floor 3 Rooms: </label>
                <div className='thirdfloor'>
                    {listOfRooms[0].map(room => (
                        <button aria-disabled>{room}</button>
                    ))}
                </div>
                
                <label style={{marginTop: "2%"}}> Floor 4 Rooms: </label>
                <div className='forthfloor'> 
                    {listOfRooms[1].map(room => (
                        <button aria-disabled>{room}</button>
                    ))}  
                </div>
            </section>}

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
                        <label> Floor: {floor}</label>
                        {floor === "3" && 
                        <div className='thirdfloor'> 
                            <img className='thirdFloorMap' src={third} width="750" height="530"
                            usemap="#thirdFloor"/>
                            <map name="thirdFloor">
                                <area shape="rect" coords="317,277,354,315" id='LC323' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC323")}}/>
                                <area shape="rect" coords="316,315,353,353" id='LC326' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC326")}}/>
                                <area shape="rect" coords="355,315,391,355" id='LC325' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC325")}}/>
                                <area shape="rect" coords="355,276,391,314" id='LC324' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC324")}}/>
                                <area shape="rect" coords="619,212,651,245" id='LC331' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC331")}}/>
                                <area shape="rect" coords="551,210,583,245" id='LC327' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC327")}}/>
                                <area shape="rect" coords="585,211,617,246" id='LC330' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC330")}}/>
                                <area shape="rect" coords="550,277,583,312" id='LC328' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC328")}}/>
                                <area shape="rect" coords="585,277,617,312" id='LC329' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC329")}}/>
                                <area shape="rect" coords="617,277,648,311" id='LC332' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC332")}}/>
                                <area shape="rect" coords="550,315,583,349" id='LC335' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC335")}}/>
                                <area shape="rect" coords="586,315,615,349" id='LC334' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC334")}}/>
                                <area shape="rect" coords="618,315,649,358" id='LC333' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC333")}}/>
                                <area shape="rect" coords="213,377,249,416" id='LC340' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC340")}}/>
                                <area shape="rect" coords="252,378,288,416" id='LC339' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC339")}}/>
                            </map>
                        </div>}

                        {floor === "4" && 
                        <div className='forthfloor'>
                            <img className='forth' src={forth} width="750" height="560" 
                            usemap="#forthFloor"></img>
                            <map name="forthFloor">
                                <area shape="rect" coords="229,13,292,49" id='LC445' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC445")}}/>
                                <area shape="rect" coords="230,53,292,86" id='LC445A'  href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC445A")}}/>
                                <area shape="rect" coords="230,88,293,122" id="LC445B"  href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC445B")}}/>
                                <area shape="rect" coords="229,126,292,176" id='LC445C' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC445C")}}/>
                                <area shape="rect" coords="347,306,367,325" id='LC416' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC416")}}/>
                                <area shape="rect" coords="369,305,387,323" id='LC417' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC417")}}/>
                                <area shape="rect" coords="390,307,407,324" id='LC418' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC418")}}/>
                                <area shape="rect" coords="348,328,366,345" id='LC430' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC430")}}/>
                                <area shape="rect" coords="369,329,387,345" id='LC437' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC437")}}/>
                                <area shape="rect" coords="390,328,407,345" id='LC435' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC435")}}/>
                                <area shape="rect" coords="348,348,367,364" id='LC438' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC438")}}/>
                                <area shape="rect" coords="389,348,407,364" id='LC436' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC436")}}/>
                                <area shape="rect" coords="444,329,480,363" id='LC434' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC434")}}/>
                                <area shape="rect" coords="483,331,519,363" id='LC432' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC432")}}/>
                                <area shape="rect" coords="552,307,570,324" id='LC419' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC419")}}/>
                                <area shape="rect" coords="573,307,592,324" id='LC420' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC420")}}/>
                                <area shape="rect" coords="593,307,611,324" id='LC421' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC421")}}/>
                                <area shape="rect" coords="614,306,631,324" id='LC422' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC422")}}/>
                                <area shape="rect" coords="634,306,653,323" id='LC423' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC423")}}/>
                                <area shape="rect" coords="552,327,570,344" id='LC431' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC431")}}/>
                                <area shape="rect" coords="574,328,589,343" id='LC429' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC429")}}/>
                                <area shape="rect" coords="595,327,610,342" id='LC428' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC428")}}/>
                                <area shape="rect" coords="615,328,631,344" id='LC427' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC427")}}/>
                                <area shape="rect" coords="634,327,653,344" id='LC425' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC425")}}/>
                                <area shape="rect" coords="553,348,570,366" id='LC430' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC430")}}/>
                                <area shape="rect" coords="634,348,652,364" id='LC426' href="" onClick={(event) => {handleAreaClick(event)
                                handleMouseOver(event, "LC426")}}/>
                            </map>
                        </div>}
                    </div>

                    {timesShown && <div className="times"> 
                        <label>Available Times</label>
                        <form id='time_form' onSubmit={handleSubmit}>
                            {roomhours.map(time => (
                                <button onClick={() => {toggle(time)}} 
                                className={selected.includes(time) ? "selected" : "timebuttons"}
                                >{time}
                                </button>
                            ))}
                        </form>
                    </div>}
                </section>
            </section>

            {showInfo && <section className='lastsection'>
                <section className="roomInfo">
                    <span className='roomInfoSection'>
                        <b>Room Information: </b>
                        <span>{roomInfo[0]}</span> 
                        <span>{roomInfo[1]}</span>
                        <span>{roomInfo[2]}</span>
                    </span> 
                </section>

                <section>
                    <button className='coolButton' onClick={() => {findReservationTime()}}>Reserve</button>
                </section>
            </section>}

            {/* Footer */}
            <footer className="bg-dark text-center text-white"> 
                <div className="footer-text">
                © 2023 Copyright: BetterRoomReserve 
                </div>
            </footer>
        </div>
    )
}