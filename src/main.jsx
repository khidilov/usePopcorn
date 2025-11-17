import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import StarsRating from "./StarsRaiting.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <StarsRating
      amount={5}
      color="blue"
      messages={["Terrible", "Awful", "So-so", "Good", "Perfect"]}
    /> */}

    <App />
  </StrictMode>
);
