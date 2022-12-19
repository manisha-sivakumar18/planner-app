var express = require("express");
var http = require("http");
var fs = require("fs");
var bodyParser = require("body-parser");
var path = require("path");

var allUsers = {};
var allTasks = {};

let app = express();
const PORT = 8080;

app.use("/", express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let getUsers = () => {
	allUsers = JSON.parse(fs.readFileSync("./data/users.json"));
	allTasks = JSON.parse(fs.readFileSync("./data/task.json"));
};

let addNewUser = () => {
	const userString = JSON.stringify(allUsers);
	const taskString = JSON.stringify(allTasks);

	fs.writeFile("./data/users.json", userString, (err) => {
		if (err) {
			console.log("Error writing file", err);
		}
	});
	fs.writeFile("./data/task.json", taskString, (err) => {
		if (err) {
			console.log("Error writing file", err);
		}
	});
};

let getAllTasks = () => {
	allTasks = JSON.parse(fs.readFileSync("./data/task.json"));
	return allTasks;
};

let addNewTask = () => {
	const taskString = JSON.stringify(allTasks);
	fs.writeFile("./data/task.json", taskString, (err) => {
		if (err) {
			console.log("Error writing file", err);
		}
	});
};

app.post("/addUser", async (request, response) => {
	await getUsers();
	allUsers[request.body.email] = {
		name: request.body.name,
		email: request.body.email,
		password: request.body.password,
	};
	allTasks[request.body.email] = {
		todo: {},
		inprogress: {},
		completed: {},
	};
	addNewUser();
	response.end();
});

app.post("/validate", (request, response) => {
	let email = request.body.email;
	let password = request.body.password;
	getUsers();
	if (email in allUsers) {
		if (password === allUsers[email].password) {
			response
				.status(200)
				.json({ message: "Success", username: allUsers[email].name });
		} else {
			response.status(401).json({ message: "Incorrect Password" });
		}
	} else {
		response.status(404).json({ message: "User not found" });
	}
});

app.post("/userExist", (request, response) => {
	getUsers();
	if (request.body.email in allUsers) {
		response.status(200).json({ message: "User found" });
	} else {
		response.status(404).json({ message: "User not found" });
	}
});

app.post("/taskExists", (request, response) => {
	getAllTasks();
	let userTask = allTasks[request.body.email];
	let taskName = request.body.taskName;
	if (
		taskName in userTask["todo"] ||
		taskName in userTask["inprogress"] ||
		taskName in userTask["completed"]
	) {
		response.status(200).json({ message: "Task Found" });
	} else {
		response.status(404).json({ message: "Task not found" });
	}
});

app.post("/addTask", async (request, response) => {
	await getAllTasks();
	allTasks[request.body.email][request.body.progress][request.body.taskName] = {
		taskName: request.body.taskName,
		projectName: request.body.projectName,
		description: request.body.description,
		progress: request.body.progress,
		startDate: request.body.startDate,
		endDate: request.body.endDate,
	};

	await addNewTask();
	response.end();
});

app.post("/getTask", async (request, response) => {
	let alltask = await getAllTasks();

	let task =
		alltask[request.body.email][request.body.progress][request.body.taskName];
	response.json(task);
});

app.post("/deleteTask", async (request, response) => {
	let alltask = await getAllTasks();
	delete allTasks[request.body.email][request.body.progress][
		request.body.taskName
	];
	addNewTask();

	response.end();
});

app.post("/getAllTask", async (request, response) => {
	let alltask = await getAllTasks();
	let tasks = alltask[request.body.email][request.body.progress];
	response.json(tasks);
});

app.get("*", (request, response) => {
	response.status(404).json({ Error: "Not a valid endpoint" });
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
