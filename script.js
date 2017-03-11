$(document).ready(function() {
	var userID = storeUser();
	$('.chat-submit').on("click", function(e) {
		handleChatSub(e);
	});

	$('.chat-list').on("click", ".delete-msg", function(e) {
		var msgID = $(this).attr('data-msg-id');
		deleteMsg(msgID);
	});

	function handleChatSub(e) {
		e.preventDefault();
		var msg = getChatVal();
		if(msg.length > 0) {
			var storedMsg = storeMsg(msg, userID);
			displayMessage(formatMsgForDisp(storedMsg), storedMsg.msgID);
		}
	}

	function formatMsgForDisp(obj) {
		var msgStr = '<li class="chat-msg" class="msg-id-' 
		+ obj.msgID
		+ '">'
		+ '<span class="delete-msg" data-msg-id="'
		+ obj.msgID
		+ '">X </span><span>'
		+ getAllUsers()[obj.userID].name
		+ " - " 
		+ obj.msg
		+ '</span>';
		return msgStr;
	}

	function getChatVal() {
		return $('.chat-text').val();
	}

	function displayMessage(msg) {
		if(msg !== null) {
			var length = $('.chat-list li').length;
			if(msg.msgId < length) {
				$('.chat-list li:eq(' + msg.msgId + ')').replaceWith(msg);
			} else {
				$('.chat-list').append(msg);
			}
		}
	}

	function displayAllStoredMsg() {
		getAllMessages().forEach(function(msg) {
			if(msg != null) {
				displayMessage(formatMsgForDisp(msg));				
			}
		});
	};

	window.addEventListener('storage', handleStoreageUpdate, false);

	function handleStoreageUpdate(e) {
		var key = e.key;
		handleMsgUpdate();
	}

	function handleMsgUpdate() {
		$('.chat-list').empty();
		displayAllStoredMsg();
	}

	function deleteMsg(msgID) {
		var ind = getAllMessages().findIndex(function(e) {
			if(e != null && e.userID === userID) {
				return e.msgID == msgID
			}
		});
		updateMsg(ind, null);
	}

	function updateMsg(arrayPos, updateVal) {
		allMessages = getAllMessages();
		allMessages[arrayPos] = updateVal;
		localStorage.setItem("messages", JSON.stringify(allMessages));
		$('.chat-list').empty();
		displayAllStoredMsg();
	}

	displayAllStoredMsg();

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
	// createLastUpdated(msgContent, "add");
	return msgContent;
}



function getAllMessages() {
	return JSON.parse(localStorage.getItem("messages")) || [];
}

// function createLastUpdated(obj, action) {
// 	localStorage.setItem("lastupdated", JSON.stringify({obj, act: action}));
// }

// function getLastUpdated(){
// 	return JSON.parse(localStorage.getItem("lastupdated"));
// }