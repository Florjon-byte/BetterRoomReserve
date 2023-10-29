import logo from './images/bern-dibner-library.jpg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import React, { Component } from "react"

class App extends Component {

  componentDidMount() {
    fetch("localhost:3000")
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  }

  render(){
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
            <button class="btn primary btn" hreft="">
              Login
            </button>
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

        {/* Second Div */}
        <div className='second'>
          <div className='purposetext'>
            <h1 className='header'>Library Information and Policies</h1>
            <p> 
              Amidst the tranquil rustling of leaves in the ancient forest, a solitary fox ventured cautiously along a winding woodland path. The dappled sunlight filtered through the dense canopy, casting intricate patterns of light and shadow upon the moss-covered ground. With a delicate grace, the fox paused, its keen senses alert to the forest's secrets. Nature's symphony played on, as birdsong blended with the distant babbling of a hidden brook, creating a mesmerizing, harmonious tapestry of sounds. In this enchanted realm, time seemed to stand still, and the fox, a silent sentinel, moved with the rhythm of the woods, a fleeting embodiment of the wild's enduring beauty.
            </p>
          </div>
        </div>

        {/* Footer */}
      </div>
    );
  }
}

export default App;


// <div class="row">
//           <div className="col dibner-image ">
//             {/* Left Side  */}
//             <div class="leftside">
//               <img class="img-fluid rounded float-start" src={logo}></img>
//               {/* <img className="front img-fluid rounded" src={front}></img> */}
//             </div>
//           </div>
//           <div className="col">
//             {/* Right Side  */}
//             <div class="rightside">
//               <div class="d-grid gap-2 col-6 mx-auto">
//                 <button class="btn btn-primary" type="button">Button</button>
//                 <button class="btn btn-primary" type="button">Button</button>
//               </div>
//             </div>
//           </div>
//         </div>