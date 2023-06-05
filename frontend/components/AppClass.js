import React from "react";
import axios from "axios";

const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4;

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor() {
    super();
    this.state = {
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
    };
  }

  getXY = (index, num) => {
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
  };

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    return `Coordinates (${this.getXY([this.state.index], [0])}, ${this.getXY(
      [this.state.index],
      [1]
    )})`;
  };

  reset = (e) => {
    // Use this helper to reset all states to their initial values.
    this.setState({
      message: "",
      email: "",
      index: 4,
      steps: 0,
    });
  };

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if (direction === "up" && this.state.index - 3 >= 0) {
      this.setState({
        message: "",
        index: this.state.index - 3,
        steps: this.state.steps + 1,
      });
    } else if (
      direction === "right" &&
      this.state.index !== 2 &&
      this.state.index !== 5 &&
      this.state.index !== 8
    ) {
      this.setState({
        message: "",
        index: this.state.index + 1,
        steps: this.state.steps + 1,
      });
    } else if (direction === "down" && this.state.index + 3 <= 8) {
      this.setState({
        message: "",
        index: this.state.index + 3,
        steps: this.state.steps + 1,
      });
    } else if (
      direction === "left" &&
      this.state.index !== 0 &&
      this.state.index !== 3 &&
      this.state.index !== 6
    ) {
      this.setState({
        message: "",
        index: this.state.index - 1,
        steps: this.state.steps + 1,
      });
    } else {
      this.setState({
        message: `You can't go ${direction}`,
      });
    }
  };

  move = (evt) => {
    if (this.state.steps == 0) return `You moved ${this.state.steps} times`;
    if (this.state.steps == 1) return `You moved ${this.state.steps} time`;
    if (this.state.steps > 1) return `You moved ${this.state.steps} times`;
  };

  onChange = (evt) => {
    // You will need this to update the value of the input.
    this.setState({
      email: evt.target.value,
    });
  };

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const x = this.getXY([this.state.index], [0]);
    const y = this.getXY([this.state.index], [1]);
    const requestObject = {
      x: x,
      y: y,
      steps: this.state.steps,
      email: this.state.email,
    };
    axios
      .post("http://localhost:9000/api/result", requestObject)
      .then((res) => {
        this.setState({
          message: res.data.message,
        });
      })
      .catch((err) => {
        this.setState({
          message: err.response.data.message,
        });
      });
    this.setState({
      email: "",
    });
  };

  render() {
    const { className } = this.props;
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">{this.move()}</h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div
              key={idx}
              className={`square${idx === this.state.index ? " active" : ""}`}
            >
              {idx === this.state.index ? "B" : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={() => this.getNextIndex("left")}>
            LEFT
          </button>
          <button id="up" onClick={() => this.getNextIndex("up")}>
            UP
          </button>
          <button id="right" onClick={() => this.getNextIndex("right")}>
            RIGHT
          </button>
          <button id="down" onClick={() => this.getNextIndex("down")}>
            DOWN
          </button>
          <button id="reset" onClick={() => this.reset()}>
            reset
          </button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            id="email"
            type="email"
            value={this.state.email}
            placeholder="type email"
            onChange={this.onChange}
          ></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    );
  }
}