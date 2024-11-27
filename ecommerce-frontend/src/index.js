import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import './App.css'

console.log("React app is starting..."); // Debug log

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

console.log("React app rendered successfully!"); // Debug log
