$(document).ready(function() {
	var userID = storeUser();
	$('.chat-submit').on("click", function(e) {
		handleChatSub(e);
	});

	function handleChatSub(e) {
		e.preventDefault();
		var msg = getChatVal();
		if(msg.length > 0) {
			var storedMsg = storeMsg(msg, userID);
			displayMessage(formatMsgForDisp(storedMsg), storedMsg.msgID);
		}
		console.log(msg)
	}

	// var msgContent = {
	// 	msg:        msg,
	// 	UserID:     userID,
	// 	timestamp:  timestamp
	// }

	function formatMsgForDisp(obj) {
		console.log(obj.userID)
		console.log(getAllUsers())
		var msgStr = '<li class="chat-msg" id="msg-id-" ' 
		+ obj.msgID 
		+ '>' 
		+ getAllUsers()[obj.userID].name
		+ " - " 
		+ obj.msg;
		return msgStr;
	}



	function getChatVal() {
		return $('.chat-text').val();
	}

	function displayMessage(msg, msgId) {
		var length = $('.chat-list li').length;
		if(msgId < length) {
			$('.chat-list li:eq(' + msgId + ')').replaceWith(msg);
		} else {
			$('.chat-list').append(msg);
		}
	}
	displayMessage();

});


function storeUser() {
	if(localStorageSupported) {
		var users = getAllUsers();
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

function getAllUsers() {
	return JSON.parse(localStorage.getItem("users"));
}

// function checkForUserStore() {
// 	return localStorage.getItem("users") != null;
// }

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
		timestamp:  timestamp,
		userID:     userID
	}
	if(msgs) {
		msgContent.msgID = msgs.length;
		msgs.push(msgContent);
		localStorage.setItem("messages", JSON.stringify(msgs));
	} else {
		msgContent.msgID = 0;
		localStorage.setItem("messages", JSON.stringify([msgContent]));
	}
	return msgContent;
}
