import logo from './images/bern-dibner-library.jpg';
import front from "./images/front-dibner.jpg"
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';


function App() {
  return (
    <div>
      {/* Navbar */}
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand"> BetterRoomReserve </a>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Profile</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Reserve</a>
              </li>
            </ul>
          </div>
          <button>
            <div class="navbar-item" href="#"> Login </div> 
          </button>
        </div>
      </nav>
      <div class="row">
        <div className="col dibner-image ">
          {/* Left Side  */}
          <div class="leftside">
            <img class="img-fluid rounded float-start" src={logo}></img>
            {/* <img className="front img-fluid rounded" src={front}></img> */}
          </div>
        </div>
        <div className="col">
          {/* Right Side  */}
          <div class="rightside">
            <div class="d-grid gap-2 col-6 mx-auto">
              <button class="btn btn-primary" type="button">Button</button>
              <button class="btn btn-primary" type="button">Button</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
