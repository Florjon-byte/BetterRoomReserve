import React, { Component } from "react";

class App extends Component {
  componentDidMount() {
    fetch("http://localhost:8080/")
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  }

  render() {
    return (
      <div className="App">
        <h1>Hello from React.js</h1>
      </div>
    );
  }
}

export default App;
