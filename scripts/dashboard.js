let addTask = document.getElementById("add-task");
let addTaskForm = document.getElementById("add-task-form");
let todoBucket = document.getElementById("todo-bucket");
let formHead = document.getElementById("form-head");
let addSubmit = document.getElementById("add-submit");
let editSubmit = document.getElementById("edit-submit");
let cancel = document.getElementById("cancel");
let progress = document.getElementById("progress");
let filter = document.getElementById("filter");
let taskToEdit;
let oldBucket;

/**
 * @description To diplay toast message
 * @param {string} message Message to be shown
 */
const displayToast = (message) => {
	let toastElement = document.getElementById("toast");
	document.getElementById("toast-content").innerHTML = message;
	toastElement.classList.toggle("hide");

	let timeoutId = setTimeout(() => {
		toastElement.classList.toggle("hide");
	}, 2500);
	document.getElementById("toast-exit").onclick = () => {
		toastElement.classList.toggle("hide");
		clearTimeout(timeoutId);
	};
};

/**
 * @description Get details entered by user
 * @return {boolean} if value entered by user is valid
 */
const getFormDetails = async () => {
	let formDetails = {};
	formDetails.taskName = addTaskForm.taskName.value;
	formDetails.projectName = addTaskForm.projectName.value;
	formDetails.progress = addTaskForm.progress.value;
	formDetails.startDate = addTaskForm.startDate.value;
	formDetails.endDate = addTaskForm.endDate.value;
	const empty = Object.values(formDetails).every((value) => value !== "");
	console.log(formDetails);
	console.log(empty);
	if (empty) {
		formDetails.email = currentUser;
		formDetails.description = addTaskForm.description.value;
		return formDetails;
	}
	return false;
};

/**
 * @description Hide sort options when clicked outside
 * @param {object} cont container of the event
 * @param {object} btn button which is clicked
 * @param {object} opt options which is displayed
 * @param {object} target event which is clicked
 */
const hideSortOptions = (cont, btn, opt, target) => {
	const container = document.getElementById(cont);
	const button = document.getElementById(btn);
	const option = document.getElementById(opt);
	hideOptions(container, button, option, target);
};

/**
 * @description Hide options when clicked outside
 * @param {object} container container of the event
 * @param {object} button button which is clicked
 * @param {object} option options which is displayed
 * @param {object} target event which is clicked
 */
const hideOptions = (container, button, option, target) => {
	if (container != target && button != target && option != target) {
		option.classList.add("hide");
	}
};

/**
 * @description Update form with task information
 * @param {object} form Form details which is to be updated
 */
const updateForm = (form) => {
	addTaskForm.taskName.value = form.taskName;
	addTaskForm.projectName.value = form.projectName;
	addTaskForm.description.value = form.description;
	addTaskForm.progress.value = form.progress;
	addTaskForm.startDate.value = form.startDate;
	addTaskForm.endDate.value = form.endDate;
};

/**
 * @description Show edit options for tasks
 * @param {object} event
 */
const showEditOption = (event) => {
	if (event.target) {
		event = event.target;
	}
	let lastEle = event.nextElementSibling;
	lastEle.classList.toggle("hide");
};

/**
 * @description Get name of task which is to be edited
 * @param {object} event
 * @return {string} Name of task
 */
const getTaskName = (event) => {
	if (event.target) event = event.target;
	const currentTask = event.closest(".task");
	const taskNameParent = currentTask.firstElementChild;
	const taskName = taskNameParent.firstElementChild;
	return taskName.innerHTML;
};

/**
 * @description Get the name of bucket in the event
 * @param {object} event
 * @return {string} name of bucket
 */
const getBucketName = (event) => {
	if (event.target) event = event.target;

	const currentBucket = event.closest(".bucket");
	let bucketName = currentBucket.lastElementChild;
	bucketName = bucketName.id.split("-")[0];
	return bucketName;
};

/**
 * @description Show the details of task to user
 * @param {object} event Even which is to be shown
 */
const showTask = async (event) => {
	formHead.innerHTML = "View Task";
	let taskName = await getTaskName(event);
	let bucketName = await getBucketName(event);
	const formDetails = await getTaskDetails(currentUser, bucketName, taskName);
	updateForm(formDetails);
	progress.classList.remove("hide");
	addTaskForm.fieldset.disabled = "disabled";
	addSubmit.classList.add("hide");
	cancel.classList.add("hide");
	addTask.classList.toggle("hide");
};

/**
 * @description Delete the task
 * @param {object} event Event which is to be deleted
 */
const deleteTask = async (event) => {
	let taskName = getTaskName(event);
	let bucketName = await getBucketName(event);
	await deleteTheTask(currentUser, bucketName, taskName);
	updateAllBuckets();
};

/**
 * @description Show edit task form
 * @param {object} event Event where it is clicked
 */
const editTask = async (event) => {
	formHead.innerHTML = "Edit Task";
	let taskName = getTaskName(event);
	let bucketName = getBucketName(event);
	taskToEdit = taskName;
	oldBucket = bucketName;
	let formDetails = await getTaskDetails(currentUser, bucketName, taskName);
	updateForm(formDetails);
	progress.classList.remove("hide");
	addTaskForm.fieldset.removeAttribute("disabled");
	progress.classList.remove("hide");
	addSubmit.classList.add("hide");
	editSubmit.classList.remove("hide");
	cancel.classList.remove("hide");
	addTask.classList.toggle("hide");
	updateAllBuckets();
};

/**
 * @description Create new task component
 * @param {object} formDetails Details of task to be created
 * @return {object} task element
 */
const createTask = (formDetails) => {
	const task = document.createElement("div");
	task.className = "task";
	task.draggable = "true";
	task.innerHTML = `  <div class="task-details">
							<div>${formDetails.taskName}</div>
							<div class="project">${formDetails.projectName}</div>
							<div class="date-container">
								<div class="dates start-date">
									<span>Start Date:</span>
									<span class="date">${formDetails.startDate}</span>
								</div>
								<div class="dates end-date">
									<span>End date:</span>
									<span class="date">${formDetails.endDate}</span>
								</div>
							</div>
						</div>
						<div class="edit-options">
							<i class="fa-solid fa-ellipsis-vertical" onclick="showEditOption(event)"></i>
							<div class="sort-options hide">
								<button class="sort-btn edit" onclick="showTask(event)">View Task</button>
								<button class="sort-btn edit" onclick="editTask(event)">Edit Task</button>
								<button class="sort-btn edit" onclick="deleteTask(event)">Delete Task</button>
							</div>
						</div>
						`;

	task.ondragover = (event) => {
		drag(event);
	};
	document.addEventListener("click", (event) => {
		if (event.target) event = event.target;
		const editTask = task.firstElementChild.nextElementSibling;
		let editTaskBtn = editTask.firstElementChild;
		let editTaskOpt = editTaskBtn.nextElementSibling;
		hideOptions(editTask, editTaskBtn, editTaskOpt, event);
	});
	return task;
};

/**
 * @description Update the bucket with current tasks
 * @param {string} email Email of current user
 * @param {string} bucketName Name of bucket
 * @param {object} allTasks Tasks in the bucket
 */
const updateBucket = async (email, bucketName, allTasks) => {
	if (!allTasks) {
		allTasks = await getAllTasks(email, bucketName);
		allTasks = Object.values(allTasks);
	}

	let bucket = document.getElementById(bucketName + "-bucket");
	bucket.replaceChildren();
	allTasks.forEach((task) => {
		let taskElement = createTask(task);
		bucket.appendChild(taskElement);
	});
};

/**
 * @description Show the task form to add new task
 * @param {string} bucketName Name of bucket
 */
const showTaskForm = async (bucketName) => {
	formHead.innerHTML = "Add Task";
	addSubmit.classList.remove("hide");
	editSubmit.classList.add("hide");
	progress.classList.add("hide");
	addTask.classList.toggle("hide");
	let today = new Date();
	addTaskForm.startDate.min = today.toISOString().slice(0, 10);
	addTaskForm.endDate.min = today.toISOString().slice(0, 10);
	addTaskForm.reset();
	addTaskForm.fieldset.removeAttribute("disabled");
	addTaskForm.progress.value = bucketName;
	addSubmit.classList.remove("hide");
	editSubmit.classList.add("hide");
	cancel.classList.remove("hide");
};

/**
 * @description Update or refresh all the buckets
 */
const updateAllBuckets = () => {
	updateBucket(currentUser, "todo");
	updateBucket(currentUser, "inprogress");
	updateBucket(currentUser, "completed");
};

//Global

document.getElementById("all-sort").onclick = () => {
	document.getElementById("all-sort-options").classList.toggle("hide");
};

document.addEventListener("click", function handleClickOutsideBox(e) {
	hideSortOptions("all-sort-cont", "all-sort", "all-sort-options", e.target);
	hideSortOptions("todo-sort-cont", "todo-sort", "todo-sort-options", e.target);
	hideSortOptions(
		"inprogress-sort-cont",
		"inprogress-sort",
		"inprogress-sort-options",
		e.target
	);
	hideSortOptions(
		"completed-sort-cont",
		"completed-sort",
		"completed-sort-options",
		e.target
	);
});

// To-do Bucket
document.getElementById("todo-sort").onclick = () => {
	document.getElementById("todo-sort-options").classList.toggle("hide");
};

document.getElementById("todo-add").onclick = (event) => {
	let bucketName = getBucketName(event);
	showTaskForm(bucketName);
};

//In Progress Bucket
document.getElementById("inprogress-sort").onclick = () => {
	document.getElementById("inprogress-sort-options").classList.toggle("hide");
};

document.getElementById("inprogress-add").onclick = (event) => {
	let bucketName = getBucketName(event);
	showTaskForm(bucketName);
};

//Completed Bucket
document.getElementById("completed-sort").onclick = () => {
	document.getElementById("completed-sort-options").classList.toggle("hide");
};

document.getElementById("completed-add").onclick = (event) => {
	let bucketName = getBucketName(event);
	showTaskForm(bucketName);
};

document.getElementById("add-close").onclick = () => {
	addTask.classList.toggle("hide");
};

cancel.onclick = () => {
	addTaskForm.reset();
	addTask.classList.toggle("hide");
};

addTaskForm.startDate.onchange = () => {
	addTaskForm.endDate.min = addTaskForm.startDate.value;
};

addTaskForm.endDate.onchange = () => {
	addTaskForm.startDate.min = addTaskForm.endDate.value;
};

addSubmit.onclick = async () => {
	let formDetails = await getFormDetails();
	console.log(formDetails);
	if (formDetails) {
		let status = await taskExists(currentUser, formDetails.taskName);
		if (status !== 200) {
			await addNewTask(formDetails);
			updateAllBuckets();
			addTask.classList.toggle("hide");
		} else {
			displayToast("A task with same name already exists");
		}
	} else {
		displayToast("Please fill all the required details");
	}
};

//Edit task
editSubmit.onclick = async () => {
	await deleteTheTask(currentUser, oldBucket, taskToEdit);
	let formDetails = await getFormDetails();
	if (formDetails) {
		await addNewTask(formDetails);
		updateAllBuckets();
		addTask.classList.toggle("hide");
	}
};

let alpha = { all: false, todo: false, inprogress: false, completed: false };
let start = { all: false, todo: false, inprogress: false, completed: false };
let end = { all: false, todo: false, inprogress: false, completed: false };

/**
 * @description Toggle alphabetical sort image
 * @param {object} element element where it is toggled
 */
const toggleAlpha = (element) => {
	console.log(element);
	if (element.target) element = element.target;
	element = element.lastElementChild;
	element.classList.toggle("fa-sort-alpha-asc");
	element.classList.toggle("fa-sort-alpha-desc");
};

/**
 * @description Toggle numerical sort image
 * @param {object} element element where it is toggled
 */
const toggleNum = (element) => {
	if (element.target) element = element.target;
	element = element.lastElementChild;
	element.classList.toggle("fa-arrow-down-1-9");
	element.classList.toggle("fa-arrow-down-9-1");
};
/**
 * @description Sort tasks in given bucket alphabetically
 * @param {string} bucketName Name of bucket
 * @param {boolean} type type of sort
 */
const sortBucketAlpha = async (bucketName, type) => {
	let allTasks = await getAllTasks(currentUser, bucketName);
	allTasks = Object.values(allTasks);
	if (type) {
		allTasks.sort((taskA, taskB) => {
			return taskB.taskName
				.toLowerCase()
				.localeCompare(taskA.taskName.toLowerCase());
		});
	} else {
		allTasks.sort((taskA, taskB) => {
			return taskA.taskName
				.toLowerCase()
				.localeCompare(taskB.taskName.toLowerCase());
		});
	}
	updateBucket(currentUser, bucketName, allTasks);
};

/**
 * @description Sort tasks alphabetically
 * @param {object} event Event where sort is clicked
 */
const sortAlpha = (event) => {
	if (event.target.id === "all-alpha-sort") {
		sortBucketAlpha("todo", alpha["all"]);
		sortBucketAlpha("inprogress", alpha["all"]);
		sortBucketAlpha("completed", alpha["all"]);
		alpha["all"] = !alpha["all"];
	} else {
		let bucketName = getBucketName(event);
		sortBucketAlpha(bucketName, alpha[bucketName]);
		alpha[bucketName] = !alpha[bucketName];
	}
	toggleAlpha(event);
};

/**
 * @description Sort tasks in given bucket based on start date
 * @param {string} bucketName Name of bucket
 * @param {boolean} type Type of sort
 */
const sortBucketStartDate = async (bucketName, type) => {
	let allTasks = await getAllTasks(currentUser, bucketName);
	allTasks = Object.values(allTasks);
	if (type) {
		allTasks.sort((taskA, taskB) => {
			return new Date(taskA.startDate) - new Date(taskB.startDate);
		});
	} else {
		allTasks.sort((taskA, taskB) => {
			return new Date(taskB.startDate) - new Date(taskA.startDate);
		});
	}
	updateBucket(currentUser, bucketName, allTasks);
};

/**
 * @description Sort tasks based on start date
 * @param {object} event Event where sort is clicked
 */
const sortStartDate = async (event) => {
	if (event.target.id === "all-start-sort") {
		sortBucketStartDate("todo", start["all"]);
		sortBucketStartDate("inprogress", start["all"]);
		sortBucketStartDate("completed", start["all"]);
		start["all"] = !start["all"];
	} else {
		let bucketName = getBucketName(event);

		sortBucketStartDate(bucketName, start[bucketName]);
		start[bucketName] = !start[bucketName];
	}
	toggleNum(event.target);
};

/**
 * @description Sort tasks in a given bucket based on end date
 * @param {string} bucketName name of bucket
 * @param {boolean} type type of sort
 */
const sortBucketEndDate = async (bucketName, type) => {
	let allTasks = await getAllTasks(currentUser, bucketName);
	allTasks = Object.values(allTasks);
	if (type) {
		allTasks.sort((taskA, taskB) => {
			return new Date(taskA.endDate) - new Date(taskB.endDate);
		});
	} else {
		allTasks.sort((taskA, taskB) => {
			return new Date(taskB.endDate) - new Date(taskA.endDate);
		});
	}
	updateBucket(currentUser, bucketName, allTasks);
};

/**
 * @description Sort tasks based on end date
 * @param {object} event Event where sort is clicked
 */
const sortEndDate = async (event) => {
	if (event.target.id === "all-end-sort") {
		sortBucketStartDate("todo", end["all"]);
		sortBucketStartDate("inprogress", end["all"]);
		sortBucketStartDate("completed", end["all"]);
		start["all"] = !start["all"];
	} else {
		let bucketName = getBucketName(event);

		sortBucketEndDate(bucketName, end[bucketName]);
		end[bucketName] = !end[bucketName];
	}
	toggleNum(event.target);
};

/**
 * @description Search and filter tasks in given bucket
 * @param {string} bucketName Name of bucket
 */
const searchTasks = async (bucketName) => {
	let allTasks = await getAllTasks(currentUser, bucketName);
	allTasks = Object.values(allTasks);
	allTasks = allTasks.filter((task) => {
		return task.taskName.toLowerCase().includes(filter.value.toLowerCase());
	});
	updateBucket(currentUser, bucketName, allTasks);
};

/**
 * @description Search and filter tasks in all buckets
 */
const searchAllTasks = async () => {
	searchTasks("todo");
	searchTasks("inprogress");
	searchTasks("completed");
};

/**
 * @description To allow drop event
 * @param {object} ev Event where drop is to be allowed
 */
function allowDrop(ev) {
	ev.preventDefault();
}

let dragObj;

/**
 * @description On drag of task set the name and progress of task dragged
 * @param {object} ev Event or task which is dragged
 */
function drag(ev) {
	dragObj = ev.target;
	oldBucketName = getBucketName(dragObj);
}

/**
 * @description On drop event, change the progress of task which is dragged
 * @param {object} event Event where the task is dropped
 */
const drop = async (event) => {
	let ev = event;

	if (ev.target) ev = ev.target;
	if (ev.id) {
		let taskName = await getTaskName(dragObj);
		let formDetails = await getTaskDetails(
			currentUser,
			oldBucketName,
			taskName
		);
		await deleteTheTask(currentUser, oldBucketName, taskName);
		formDetails.progress = ev.id.split("-")[0];

		formDetails.email = currentUser;
		await addNewTask(formDetails);
		updateAllBuckets();
	}
	event.preventDefault();
};
