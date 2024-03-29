import React, { useState } from "./core/React";

function Foo() {
	const [count, setCount] = useState(10);
	const [bar, setBar] = useState("bar");

	function handleClick() {
		setCount((count) => ++count);
		setCount((count) => ++count);
		setBar((bar) => "bar");
	}
	return (
		<div>
			<div>
				Foo 
				<br></br> - {count}
				<br></br> - {bar}
				<br></br> - <button onClick={handleClick}>click</button>
			</div>
		</div>
	);
}

let app = 100;
function App() {
	return (
		<div>
			<div>hahah</div>
			<Foo></Foo>
		</div>
	);
}

export default App;
