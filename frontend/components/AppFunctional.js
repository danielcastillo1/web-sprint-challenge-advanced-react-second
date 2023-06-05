import React, { useState } from "react";
import axios from "axios";

// Suggested initial states
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);

  function getXY(index, num) {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const cords = [
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3],
    ];
    return cords[index][num];
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    return `Coordinates (${getXY([index], [0])}, ${getXY([index], [1])})`;
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setMessage(initialMessage);
    setSteps(initialSteps);
    setEmail(initialEmail);
    setIndex(initialIndex);
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if (direction === "up" && index - 3 >= 0) {
      setMessage("");
      setIndex(index - 3);
      setSteps(steps + 1);
    } else if (
      direction === "right" &&
      index !== 2 &&
      index !== 5 &&
      index !== 8
    ) {
      setMessage("");
      setIndex(index + 1);
      setSteps(steps + 1);
    } else if (direction === "down" && index + 3 <= 8) {
      setMessage("");
      setIndex(index + 3);
      setSteps(steps + 1);
    } else if (
      direction === "left" &&
      index !== 0 &&
      index !== 3 &&
      index !== 6
    ) {
      setMessage("");
      setIndex(index - 1);
      setSteps(steps + 1);
    } else {
      setMessage(`You can't go ${direction}`);
    }
  }

  function move() {
    if (steps == 0) return `You moved ${steps} times`;
    if (steps == 1) return `You moved ${steps} time`;
    if (steps > 1) return `You moved ${steps} times`;
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const x = getXY([index], [0]);
    const y = getXY([index], [1]);
    const requestObject = {
      x: x,
      y: y,
      steps: steps,
      email: email,
    };
    axios
      .post("http://localhost:9000/api/result", requestObject)
      .then((res) => {
        setMessage(res.data.message);
      })
      .catch((err) => {
        setMessage(err.response.data.message);
      });
    setEmail("");
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">{move()}</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === index ? " active" : ""}`}>
            {idx === index ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => getNextIndex("left")}>
          LEFT
        </button>
        <button id="up" onClick={() => getNextIndex("up")}>
          UP
        </button>
        <button id="right" onClick={() => getNextIndex("right")}>
          RIGHT
        </button>
        <button id="down" onClick={() => getNextIndex("down")}>
          DOWN
        </button>
        <button id="reset" onClick={() => reset()}>
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          value={email}
          placeholder="type email"
          onChange={onChange}
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}