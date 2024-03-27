import React from "./core/React";

let count = 1;
let props = { id: 123 };
function Counter() {
	function handleClick() {
		count++;
		props = {};
		console.log(props);
		React.update();
	}
	return (
		<div {...props}>
			count: {count}
			<button onClick={handleClick}>click</button>
		</div>
	);
}
function CounterContainer() {
	return <Counter></Counter>;
}

function App() {
	return (
		<div>
			app
			<div>hahah</div>
			<Counter></Counter>
			{/* <CounterContainer num={12}></CounterContainer> */}
		</div>
	);
}

export default App;
