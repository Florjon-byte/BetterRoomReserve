import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import React, { Component, useEffect, useState} from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Reserve } from './pages/Reserve' 
import { Profile } from './pages/Profile' 
import { Home } from "./pages/HomePage"

const App = () => {
    return (
      <Router> 
            <Routes> 
                <Route exact path="/" element={<Home/> }/>
                <Route exact path="/reserve" element={<Reserve/>}/>
                <Route exact path="/profile" element={<Profile/> }/> 
            </Routes>
        </Router>
    );
}

export default App;
