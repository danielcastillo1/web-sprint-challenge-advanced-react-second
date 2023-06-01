import axios from "axios";
import React, { useState } from "react";

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

	function getXY() {
		const cords = {
      0: '1,1',
      1: '1,2',
      2: '1,3',
      3: '2,1',
      4: '2,2',
      5: '2,3',
      6: '3,1',
      7: '3,2',
      8: '3,3'
    }
    return cords[index];
	}

	function reset() {
		setMessage(initialMessage);
    setSteps(initialSteps);
    setEmail(initialEmail);
    setIndex(initialIndex);
	}

	function onSubmit(evt) {
		evt.preventDefault();
    const x = getXY().split(',')[0];
    const y = getXY().split(',')[1];
    const requestObject = {
      email: email,
      steps: steps,
      x: parseInt(x),
      y: parseInt(y)
    };
    axios.post('http://localhost:9000/api/result', requestObject).then(res => {
      setMessage(res.data.message);
    }).catch(err => {
      setMessage(err.response.data.message);
    })
	}

	const up = () => {
		if (index - 3 >= 0) {
      setMessage("");
			setSteps(steps + 1);
			setIndex(index - 3);
		} else {
      setMessage("you can't go up");
    }
	};

	const left = () => {
		if (index !== 0 && index !== 3 && index !== 6) {
      setMessage('');
			setSteps(steps + 1);
			setIndex(index - 1);
		} else {
      setMessage("you can't go left");
    }
	};

	const right = () => {
		if (index !== 2 && index !== 5 && index !== 8) {
      setMessage('');
			setSteps(steps + 1);
			setIndex(index + 1);
		} else {
      setMessage("you can't go right");
    }
	};

	const down = () => {
		if (index + 3 <= 8) {
      setMessage('');
			setSteps(steps + 1);
			setIndex(index + 3);
		} else {
      setMessage("you can't go down");
    }
	};

	return (
		<div id="wrapper" className={props.className}>
			<div className="info">
				<h3 id="coordinates">Coordinates ({getXY()})</h3>
				<h3 id="steps">You moved {steps} times</h3>
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
				<button onClick={() => left()} id="left">
					LEFT
				</button>
				<button onClick={() => up()} id="up">
					UP
				</button>
				<button onClick={() => right()} id="right">
					RIGHT
				</button>
				<button onClick={() => down()} id="down">
					DOWN
				</button>
				<button onClick={() => reset()} id="reset">
					reset
				</button>
			</div>
			<form onSubmit={onSubmit}>
				<input value={email} onChange={(e) => setEmail(e.target.value)} id="email" type="email" placeholder="type email"></input>
				<input id="submit" type="submit"></input>
			</form>
		</div>
	);
}