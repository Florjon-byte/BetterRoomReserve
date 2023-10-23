import React, { Component } from "react";
import "./App.css";
import logo from "./logo.svg";

class App extends Component {
  componentDidMount() {
    fetch("localhost:3000/get_data")
      .then((response) => response.body)
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  }

  // useEffect(() => {
  //   componentDidMount();
  // },[])

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
