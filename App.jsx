import React from "./core/React";

let count1 = 1;
let count2 = 2;

function Counter1() {
	console.log("Counter1 update");
	const update = React.update();
	function handleClick() {
		count1++;
		update();
	}
	return (
		<div>
			<div>
				Counter1 - {count1} - <button onClick={handleClick}>click</button>
			</div>
		</div>
	);
}
function Counter2() {
	console.log("Counter2 update");
	const update = React.update();
	function handleClick() {
		count2++;
		update();
	}
	return (
		<div>
			<div>
				Counter2 - {count2} - <button onClick={handleClick}>click</button>
			</div>
		</div>
	);
}

let app = 100;
function App() {
	console.log("app update");
	const update = React.update();
	function handleClick() {
		app++;
		update();
	}
	return (
		<div>
			app - {app} - <button onClick={handleClick}>click</button>
			<div>hahah</div>
			<Counter1></Counter1>
			<Counter2></Counter2>
		</div>
	);
}

export default App;
