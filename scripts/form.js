var currentUser;
/**
 * @description Toggle between sign-in and sign-up forms
 */
const toggleForms = () => {
	document.getElementById("sign-up-form-cont").classList.toggle("hide");
	document.getElementById("sign-up-form").reset();
	document.getElementById("sign-in-form-cont").classList.toggle("hide");
	document.getElementById("sign-in-form").reset();
};

/**
 * @description Validate information given by user
 * @param {string} email Email
 * @param {string} pwd Password
 * @return {boolean} Is information valid or not
 */
const validateInfo = (email, pwd) => {
	var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if (email != "" && email.match(mailformat)) {
		let pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
		if (pwd.match(pattern)) {
			return true;
		}
	}
	return false;
};

document.getElementById("sign-up-button").onclick = async () => {
	let name = document.getElementById("sign-up-name").value;
	let email = document.getElementById("sign-up-email").value;
	let password = document.getElementById("sign-up-pwd").value;
	let confirmPwd = document.getElementById("sign-up-pwd2").value;
	if (password === confirmPwd) {
		let valid = await validateInfo(email, password);
		if (valid) {
			let status = await checkUserExist(email);
			if (status === 200) {
				displayToast("An account with this email already exists.");
			} else if (status === 404) {
				let currstatus = await addNewUser(name, email, password);
				if (currstatus === 200) {
					toggleForms();
				} else {
					displayToast("An error occurred while processing your request.");
				}
			}
		} else {
			displayToast("Please fill all fields correctly");
		}
	} else {
		displayToast("Password and Confirm password do not match");
	}
};

document.getElementById("sign-in-button").onclick = async () => {
	let email = document.getElementById("sign-in-email").value;
	let password = document.getElementById("sign-in-pwd").value;
	let response = await validateUserDetails(email, password);
	if (response.status === 200) {
		let result = await response.json();
		currentUser = email;
		document.getElementById("form-box").classList.toggle("hide");
		document.getElementById("sign-in-form").reset();
		document.getElementById("current-user").innerHTML = result.username;
		document.getElementById("dashboard").classList.toggle("hide");
		updateAllBuckets();
	} else if (response.status === 401) {
		displayToast("The email or password entered in invalid. Please try again.");
	} else if (response.status === 404) {
		displayToast("User not found. Try with different email or create new one.");
	}
};

document.getElementById("sign-up-link").onclick = () => {
	toggleForms();
};

document.getElementById("sign-in-link").onclick = () => {
	toggleForms();
};

document.getElementById("sign-up-pwd").onfocus = () => {
	document.getElementById("pwd-req").classList.toggle("hide");
};

document.getElementById("sign-up-pwd").onblur = () => {
	document.getElementById("pwd-req").classList.toggle("hide");
};
