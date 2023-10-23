import logo from './images/bern-dibner-library.jpg';
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
      <img class="img-fluid rounded custom-image" src={logo}></img>
    </div>
  );
}

export default App;
