import React, { useState, useEffect } from "../core/React";

export default function Todos() {
	const [filter, setFilter] = useState("all");
	const [todos, setTodos] = useState([]);
	const [displayTodos, setDisplayTodos] = useState([]);
	useEffect(() => {
		const rawTodos = localStorage.getItem("todos");
		if (rawTodos) {
			setTodos(JSON.parse(rawTodos));
		}
	}, []);
	useEffect(() => {
		let newTodos = todos;
		if (filter === "done") {
			newTodos = todos.filter((todo) => todo.status === "done");
		} else if (filter === "active") {
			newTodos = todos.filter((todo) => todo.status === "active");
		}
		setDisplayTodos(newTodos);
	}, [filter, todos]);
	function handleAdd() {
		addTodo(inputValue);
		setInputValue("");
	}
	function createTodo(title) {
		return { id: crypto.randomUUID(), title, status: "active" };
	}
	function addTodo(title) {
		if (!title) {
			return;
		}
		setTodos((todos) => [...todos, createTodo(title)]);
	}
	const [inputValue, setInputValue] = useState("");

	function saveTodos() {
		if (!todos) {
			return;
		}
		localStorage.setItem("todos", JSON.stringify(todos));
	}
	function removeTodo(id) {
		setTodos((todos) => todos.filter((todo) => todo.id !== id));
	}
	function doneTodo(id) {
		setTodos((todos) =>
			todos.map((todo) => {
				if (todo.id === id) {
					todo.status = "done";
				}
				return todo;
			})
		);
	}
	function cancelTodo(id) {
		setTodos((todos) =>
			todos.map((todo) => {
				if (todo.id === id) {
					todo.status = "active";
				}
				return todo;
			})
		);
	}

	return (
		<div>
			<h2>TODO</h2>
			<div>
				<input
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
				/>
				<button onClick={handleAdd}>add</button>
			</div>
			<div>
				<button onClick={saveTodos}>save</button>
			</div>
			<div>
				<input
					type="radio"
					name="filter"
					id="all"
					value="all"
					checked={filter === "all"}
					onChange={() => setFilter("all")}
				/>
				<label htmlFor="all">all</label>

				<input
					type="radio"
					name="filter"
					id="done"
					value="done"
					checked={filter === "done"}
					onChange={() => setFilter("done")}
				/>
				<label htmlFor="done">done</label>

				<input
					type="radio"
					name="filter"
					id="active"
					value="active"
					checked={filter === "active"}
					onChange={() => setFilter("active")}
				/>
				<label htmlFor="active">active</label>
			</div>
			<ul>
				{...displayTodos.map((todo) => (
					<TodoItem
						todo={todo}
						removeTodo={removeTodo}
						cancelTodo={cancelTodo}
						doneTodo={doneTodo}
					></TodoItem>
				))}
			</ul>
		</div>
	);
}

function TodoItem({ todo, removeTodo, cancelTodo, doneTodo }) {
	return (
		<li className={todo.status}>
			{todo.title}&nbsp;&nbsp;
			{todo.status === "done" ? (
				<button onClick={() => cancelTodo(todo.id)}>cancel</button>
			) : (
				<button onClick={() => doneTodo(todo.id)}>done</button>
			)}
			<button onClick={() => removeTodo(todo.id)}>remove</button>
		</li>
	);
}
