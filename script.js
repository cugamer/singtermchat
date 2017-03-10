$(document).ready(function() {
	$('.chat-submit').on("click", function(e) {
		handleChatSub(e);
	});

	function handleChatSub(e) {
		e.preventDefault();
		alert("working");
	}
});

var userId = storeUser();

function storeUser() {
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
			localStorage.setItem("users", JSON.stringify([userInfo]));
		}
		return length++;
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

function storeMsg(msg, userID) {
	var msgs = JSON.parse(localStorage.getItem("messages"));
	var timestamp = Date.now();
	var msgContent = {
		msg:        msg,
		UserID:     userID,
		timestamp:  timestamp
	}
	if(msgs) {
		msgs.push(userInfo);
		localStorage.setItem("messages", JSON.stringify(messages));
	} else {
		localStorage.setItem("messages", JSON.stringify([msgContent]));
	}
}