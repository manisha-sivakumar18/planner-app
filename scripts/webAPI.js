/**
 * @description Validate if user details are correct
 * @param {string} email Email of user
 * @param {string} password Password enetered
 * @return {object} response
 */
const validateUserDetails = async (email, password) => {
	let request = {
		email: email,
		password: password,
	};
	let response = await fetch("http://localhost:8080/validate", {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(request),
	});
	return response;
};

/**
 * @description Check if a user exists
 * @param {string} email Email of user
 * @return {number} status
 */
const checkUserExist = async (email) => {
	let request = {
		email: email,
	};
	let response = await fetch("http://localhost:8080/userExist", {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(request),
	});
	return response.status;
};

/**
 * @description Add new user
 * @param {string} name Name of user
 * @param {string} email Email of user
 * @param {string} password Password of user
 * @return {number} status
 */
const addNewUser = async (name, email, password) => {
	let request = {
		name: name,
		email: email,
		password: password,
	};
	let response = await fetch("http://localhost:8080/addUser", {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(request),
	});
	return response.status;
};

/**
 * @description Add new task
 * @param {object} formDetails details of task to be added
 * @return {number} status
 */
const addNewTask = async (formDetails) => {
	let response = await fetch("http://localhost:8080/addTask", {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(formDetails),
	});
	return response.status;
};

/**
 * @description Delete given task
 * @param {string} email Email of current user
 * @param {string} progress Bucket whose details is needed
 * @param {string} taskName Name of task
 */
const deleteTheTask = async (email, progress, taskName) => {
	let request = {
		email: email,
		progress: progress,
		taskName: taskName,
	};
	let response = await fetch("http://localhost:8080/deleteTask", {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(request),
	});
};

/**
 * @description Check if a task exists
 * @param {string} email Email of current user
 * @param {string} taskName Name of task
 * @return {*}
 */
const taskExists = async (email, taskName) => {
	let request = {
		email: email,
		taskName: taskName,
	};
	let response = await fetch("http://localhost:8080/taskExists", {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(request),
	});
	return response.status;
};

/**
 * @description Get details of givven task
 * @param {string} email Email of current user
 * @param {string} progress Bucket whose details is needed
 * @param {*} taskName Name of task
 * @return {*}
 */
const getTaskDetails = async (email, progress, taskName) => {
	let request = {
		email: email,
		progress: progress,
		taskName: taskName,
	};
	let response = await fetch("http://localhost:8080/getTask", {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(request),
	});
	let result = await response.json();
	return result;
};

/**
 * @description Get all task details
 * @param {string} email Email of current user
 * @param {string} progress Bucket whose details is needed
 * @return {object}
 */
const getAllTasks = async (email, progress) => {
	let request = {
		email: email,
		progress: progress,
	};
	let response = await fetch("http://localhost:8080/getAllTask", {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(request),
	});
	let result = await response.json();
	return result;
};
