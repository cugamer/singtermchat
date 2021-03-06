$(document).ready(function() {
	var userID = storeUser();
	// Event handlers
	$('.chat-submit').on("click", function(e) {
		handleChatSubmit(e);
	});

	$('form.chat-input').on("submit", function(e) {
		handleChatSubmit(e);
	});

	$('.chat-list').on("click", ".delete-msg", function(e) {
		var msgID = getValueByAttr(this, 'data-msg-id');
		deleteMsg(msgID);
	});

	$('.chat-list').on("click", ".msg-text", function(e) {
		if(getValueByAttr(this,'data-user-id') == userID) {
			selectFieldText(this);
		}
	});

	$('.chat-list').on("change", ".msg-text", function(e) {
		var pos = getValueByAttr(this, 'data-msg-id');
		var val = getElementVal(this);
		editMsg(pos, val);
	});

	$('.users-list').on("click", ".user-text", function(e) {
		if(getValueByAttr(this, 'data-user-id') == userID) {
			selectFieldText(this);
		}
	});

	$('.users-list').on("change", ".user-text", function(e) {
		var pos = getValueByAttr(this, 'data-user-id');
		var val = getElementVal(this);
		editUserName(pos, val);
	});

	window.addEventListener('storage', handleStoreageUpdate, false);

	window.addEventListener("unload", function (e) {
		disableUser();
		return null;
	});

	// Handle updates to storage
	function handleStoreageUpdate(e) {
		var key = e.key;
		handleMsgUpdate();
		handleUsersUpdate();
	}

	function handleMsgUpdate() {
		emptyList('.chat-list');
		displayAllStoredMsg();
		$('.msg-text').autogrow({onInitialize: true, animate: false, fixMinHeight: false});
		autoScrollChat();
	}

	function handleUsersUpdate() {
		emptyList('.users-list');
		displayAllActiveUsers();
	}

	function emptyList(listClass) { // Separate function to isolate dependency
		$(listClass).empty();
	}

	function getValueByAttr(element, attr) {
		return $(element).attr(attr);
	}

	function selectFieldText(element) {
		$(element).select();
	}
	// Capture chat submission
	function handleChatSubmit(e) {
		e.preventDefault();
		var msg = getElementVal('.chat-text');
		if(msg.length > 0) {
			var storedMsg = storeMsg(msg, userID);
			clearChatField();
			displayMessage(formatMsgForDisp(storedMsg), storedMsg.msgID);
			$('.msg-text').autogrow({onInitialize: true, animate: false, fixMinHeight: false});
			autoScrollChat();
			focusToChatInput();
		}
	}

	function getElementVal(ele) {
		return $(ele).val();
	}

	function clearChatField() {
		$('.chat-text').empty();
	}

	// Message formatting and display
	function formatMsgForDisp(obj) {
		var deleteX;
		var readOnly;
		var usersMsg;
		if(obj.userID === userID) {
			deleteX = '<span class="delete-msg" data-msg-id="'+ obj.msgID + '"><i class="fa fa-trash" aria-hidden="true"></i> </span>';
			readOnly = "";
			usersMsg = "own-msg";
		} else {
			deleteX = "";
			readOnly = "readonly";
			usersMsg = "others-msg";
		}
		var msgStr = '<li class="chat-msg '
			+ usersMsg
			+ '" data-msg-id="'
			+ obj.msgID
			+ '"><span class="chat-meta">'
			+ deleteX
			+ '<span class="user-name"></span>'
			+ getAllUsers()[obj.userID].name
			+ '<textarea class="msg-text" data-msg-id="'
			+ obj.msgID
			+ '" '
			+ 'data-user-id="'
			+ obj.userID
			+ '" '
			+ readOnly
			+ '>' + obj.msg + '</textarea></span>';
		return msgStr;
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

	// Users formatting and display
	function formatUserForDisp(obj) {
		var readOnly;
		var userSelf;
		if(obj.id === userID) {
			readOnly = "";
			userSelf = "user-self"
		} else {
			readOnly = "readonly";
			userSelf = "";
		}
		var userStr = '<li class="user-name '
			+ userSelf
			+ '" data-user-id="'
			+ obj.id
			+ '"><input class="user-text" value="'
			+ obj.name
			+ '" data-user-id="'
			+ obj.id
			+ '" '
			+ readOnly
			+'></input></li>';
		return userStr;
	}

	function displayUser(user) {
		if(user !== null) {
			var length = $('.users-list li').length;
			if(user.id < length) {
				$('.users-list li:eq(' + user.id + ')').replaceWith(user);
			} else {
				$('.users-list').append(user);
			}
		}
	}

	function displayAllActiveUsers() {
		getAllUsers().forEach(function(user) {
			if(user != null && user.active) {
				displayUser(formatUserForDisp(user));				
			}
		});
	};

	// Handle existing message deletes and edits
	function deleteMsg(msgID) {
		var index = getMsgIndexByID(msgID);
		updateMsg(index, null);
	}

	function editMsg(msgID, newMsg) {
		var index = getMsgIndexByID(msgID);
		var editedMsg = getAllMessages()[index];
		editedMsg.msg = newMsg;
		updateMsg(index, editedMsg);
	}

	function getMsgIndexByID(id) {
		var index = getAllMessages().findIndex(function(e) {
			if(e != null && e.userID === userID) {
				return e.msgID == id;
			}
		});
		return index;
	}

	function updateMsg(arrayPos, updateVal) {
		allMessages = getAllMessages();
		allMessages[arrayPos] = updateVal;
		localStorage.setItem("messages", JSON.stringify(allMessages));
		$('.chat-list').empty();
		displayAllStoredMsg();
		$('.msg-text').autogrow({onInitialize: true, animate: false, fixMinHeight: false});
		autoScrollChat();
	}

	// Handle existing users deletes and edits
	function disableUser() {
		var storedUsers = getAllUsers();
		var ind = storedUsers.findIndex(function(e) {
			if(e != null && e.id == userID) {
				return true;
			}
		});
		var editedUser = storedUsers[ind];
		editedUser.active = false;
		updateUser(userID, editedUser);
	}

	function editUserName(userID, newName) {
		var storedUsers = getAllUsers();
		var ind = storedUsers.findIndex(function(e) {
			if(e != null && e.id == userID) {
				return true;
			}
		});
		var editedUser = storedUsers[ind];
		editedUser.name = newName;
		updateUser(ind, editedUser);
	}

	function updateUser(arrayPos, updateVal) {
		allUsers = getAllUsers();
		allUsers[arrayPos] = updateVal;
		localStorage.setItem("users", JSON.stringify(allUsers));
		handleMsgUpdate();
	}

	displayAllStoredMsg();
	displayAllActiveUsers();

	// Resizing and styling
	$('.msg-text').autogrow({onInitialize: true, animate: false, fixMinHeight: false});
	function autoScrollChat() {
		var objDiv = document.querySelector(".chat-list");
		objDiv.scrollTop = objDiv.scrollHeight;
	}

	$('.chat-area').on('keypress', 'textarea', function(e) {
		if(e.keyCode === 13) {
			var msgID = getValueByAttr(this, 'data-msg-id');
			var newMsg = $(this).val();
			editMsg(msgID, newMsg) 
		}
	});

	$('body').on('keypress', 'textarea', function(e) {
		if(e.keyCode === 13) {
			$(this).submit();
			e.preventDefault();
		}
	});

	function focusToChatInput() {
		$('.chat-text').focus();
	}


	// Voice input
	// Check browser because SpeechRecognition currently only properly supported on Chrome
	if (document.createElement('input').webkitSpeech === undefined) {
		window.SpeechRecognition = window.webkitSpeechRecognition;
		var recognition = new SpeechRecognition();
		recognition.interimResults = true;

		// Add the mic button if supported
		$('.chat-input')
			.append('<button class="mic chat-button"><i class="fa fa-microphone" aria-hidden="true"></i></button>')
		// Add event handler
		$('.mic').on("click", handleMicButton);
		function handleMicButton(e) {
			e.preventDefault();
			if($(this).hasClass('recording')) {
				stopListening();
			} else {
				startListening();
				$(this).addClass('recording');
				$(this).html('<i class="fa fa-microphone-slash" aria-hidden="true"></i>');
			}
		}

		function startListening() {
			recognition.addEventListener('result', function(e) {
			    var transcript = Array.from(e.results)
			      .map(result => result[0])
			      .map(result => result.transcript)
			      .join("");			    
						console.log(transcript)
			    $('.chat-text').html(transcript);
			});
			// Listen for user to stop speaking, end recording in that event
			recognition.addEventListener('end', stopListening);
		    recognition.start();
		}

		function stopListening() {
			$('.mic').removeClass('recording');
			$('.mic').html('<i class="fa fa-microphone" aria-hidden="true"></i>');
			recognition.stop();
		}
	}
	
	focusToChatInput();
	autoScrollChat();
});

// Verify client supports local storage
function localStorageSupported() {
	try {
		return "localStorage" in window && window["localStorage"] !== null;
	} catch (e) {
		return false;
	}
}

// Add, update and retrieve user information from storage
function storeUser() {
	if(localStorageSupported) {
		var users = getAllUsers();
		var length = users ? users.length : 0;
		var userInfo = {
			name:    "guest_" + length,
			id:      length,
			active:  true
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

// Add, update and retrieve messages from local storage
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

function getAllMessages() {
	return JSON.parse(localStorage.getItem("messages")) || [];
}