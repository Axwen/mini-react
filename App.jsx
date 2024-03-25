import React from "./core/React";

function Counter({ num }) {
	return <div>count: {num}</div>;
}
function CounterContainer({ num }) {
	return <Counter num={num}></Counter>;
}
function App() {
	return (
		<div>
			app
			<div>hahah</div>
			<Counter num={22}></Counter>
			<CounterContainer num={12}></CounterContainer>
		</div>
	);
}

export default App;
