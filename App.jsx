import React, { useState, useEffect } from "./core/React";

function Foo() {
	const [count, setCount] = useState(10);
	const [bar, setBar] = useState("bar");

	useEffect(() => {
		console.log("init");
		return ()=>{
			console.log('init-cleanup')
		}
	}, []);
	useEffect(() => {
		console.log("update1", count);
		return ()=>{
			console.log('update-cleanup1')
		}
	}, [count]);
	useEffect(() => {
		console.log("update2", count);
		return ()=>{
			console.log('update-cleanup2')
		}
	}, [count]);

	function handleClick() {
		// setCount((count) => ++count);
		setCount((count) => ++count);
		// setBar((bar) => "bar");
		setBar((bar) => bar + "bar");
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
