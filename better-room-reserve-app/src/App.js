import './cssfiles/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import React from "react"
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom"
import { Reserve } from './pages/Reserve' 
import { Profile } from './pages/Profile'
import { LoginPage } from "./pages/LoginPage"  
import { Home } from "./pages/HomePage"

const App = () => {

    return (
      <Router> 
            <Routes> 
                <Route exact path="/" element={<Home/> }/>
                <Route exact path="/reserve" element={<Reserve/>}/>
                <Route exact path="/profile" element={<Profile/> }/> 
                <Route exact path="/login" element={<LoginPage/> }/>
            </Routes>
        </Router>
    );
}

export default App;
