import logo from '../images/bern-dibner-library.jpg';
import { useNavigate } from 'react-router-dom';
import '../cssfiles/App.css';


export function Home(){
  const navigate = useNavigate()

  const handleLoginClick = () => { 
    navigate("/login")
  }

  const handleLogoutClick = () => {
    localStorage.clear()
    navigate("/")
  }

  const handleProfileClick = () => {
    if(!localStorage.getItem("token")){
      navigate("/login")
    }
  
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
                <a class="nav-link" href="/reserve">Reserve</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href={localStorage.getItem("token") ? "/profile" : "/login"}>Profile</a>
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

      {/* Homepage */}

      {/* First Div */}
      <div className="sections"> 
        <img className="img rounded" src={logo}/>
        <div className="purposetext">
          <h2 className="header"> What is BetterRoomReserve? </h2>
          <p> 
            Amidst the tranquil rustling of leaves in the ancient forest, a solitary fox ventured cautiously along a winding woodland path. The dappled sunlight filtered through the dense canopy, casting intricate patterns of light and shadow upon the moss-covered ground. With a delicate grace, the fox paused, its keen senses alert to the forest's secrets. Nature's symphony played on, as birdsong blended with the distant babbling of a hidden brook, creating a mesmerizing, harmonious tapestry of sounds. In this enchanted realm, time seemed to stand still, and the fox, a silent sentinel, moved with the rhythm of the woods, a fleeting embodiment of the wild's enduring beauty.
          </p>
        </div>
      </div>

      <div className='button-group'>
        <button className='nyubutton' onClick={() => navigate("/reserve")}>Reserve an Individual Room</button>
        <button className='nyubutton' onClick={() => navigate("/reserve")}>Reserve a Large Room</button>
      </div>

      {/* Second Div */}
      <div className='second'>
        <div className='purposetexttwo'>
          <h1 className='header'>Library Information and Policies</h1>
          <p> 
          Group study rooms are a popular service. To help this work well for all students, please adhere to the following policies:
          </p>
          <ul className='list'>
            <li> 
              Do not eat full meals or messy foods in the study rooms. If you don’t comply, you will be asked to leave.
            </li>
            <li>
              Rooms cannot be reserved or held by placing personal belongings in them. Materials and personal items left unattended may be removed by library staff.
            </li>
            <li>
              Group rooms may not be reserved or held for a single user only. Single users in a group study room (with or without reservations) will be asked to vacate the room for groups of 2 or more for small rooms, and 4 or more for large rooms.
            </li>
            <li>
              For small group study rooms, we ask that least 2 students occupy the room. For large group study rooms, we ask that at least 4 students occupy the room.
            </li>
            <li>
              Have your email confirmation handy as you may need to verify your reservation.
            </li>
            <li>
            There is a 15 minute grace period for reservations. Reservations will be canceled if a group is more than 15 minutes late.
            </li>
          </ul>
        </div>
      </div>

      {/* Better Room Reserve stuff  */}
      <div className='instruction'> 
        <div className=''>
          <h1 className='header'> Instructions </h1>
          <p>
            Welcome to BetterRoomReserve, we welcome you to a cleaner UI that NYU doesnt pay anyone to update 
          </p>
          <ul className='list'>
            <li>
              Look around and enjoy the great UI that was developed by TWO people 
            </li>
            <li>
              Go to reserve page and use the filter to view what rooms are available for your criteria (Note: you must be logged in)
            </li>
            <li>
              Click on times to which you want to reserve your room, they must be consecutive times, and get some room information in the meantime
            </li>
            <li>
              Click Reserve and thats it!
            </li>
            <li>
              If you wish to view or cancel a reservation, go over to the profile page and press cancel to drop your reservation
            </li>
          </ul>
        </div> 
        <div>
          <iframe width="500" height="300" src="https://www.youtube.com/embed/EE-xtCF3T94" title="Who&#39;s That Pokemon?" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-center text-white"> 
        <div className="footer-text">
          © 2023 Copyright: BetterRoomReserve 
        </div>
      </footer>
    </div>
  )
}