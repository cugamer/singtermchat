$(document).ready(function() {
	$('.chat-submit').on("click", function(e) {
		handleChatSub(e);
	});

	function handleChatSub(e) {
		e.preventDefault();
		alert("working");
	}
});

var userId;

function setupUser() {
	if(localStorageSupported) {
		var users = JSON.parse(localStorage.getItem("users"));
		var length = users ? users.length : 0;
		var userInfo = {
			name:  "guest_" + length
		}
		if(users) {
			users.push(userInfo);
			localStorage.setItem("users", JSON.stringify(users));
		} else {
			// var userInfo = {
			// 	id:    0,
			// 	name:  null
			// }
			localStorage.setItem("users", JSON.stringify([userInfo]));
		}
	}
}

function checkForUserStore() {
	return localStorage.getItem("users") != null;
}

function localStorageSupported() {
	try {
		return "localStorage" in window && window["localStorage"] !== null;
	} catch (e) {
		return false;
	}
}

function createUserId() {

}

setupUser();