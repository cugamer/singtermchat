singtermchat
============

This was created as part of a coding challenge.  It's a chat program which runs in a single web browser and makes use of the browser local storage to hold users (browser windows) and messages those users send.  Each chat sessions is contained within a single browser and cannot be share across browsers as each maintians it's own local storage.  This is written in JavaScript with a liberal sprinkling of jQuery and the Nightwatch framework for some basic end to end testing.

Features
--------
* Realtime display of all users in chat.
* Ability of users to update usernames and see that reflected in all chat instances.
* Ability to create, edit or delete chat messages (edit and delete limited to msg owner) and see that reflected in all chat instances.
* Basic support for speech recognition (Chrome only at present.)

Installation and Use
--------------------
1. Ensure node.js is available.
2. Download all files and navigate to folder root.
3. Run "node server.js"  This will launch a basic node server.
4. Navigate to localhost:3000 in your browser.  Each open window is a seperate chat instance and instances are deleted on close

Usernames and existing messages can be updated by clicking them, updating the text and pressing enter.  Messages can be deleted by pressing the trash icon on each chat bubble.

To use speech recognition click the mic icon at the bottom and begin speaking.  This disables automatically if there is a pause in speech.  Be aware that speech recognition is still a nascent technology and this implementation is rudamentary at best.

Features
--------
* Realtime display of all users in chat.
* Ability of users to update usernames and see that reflected in all chat instances.
* Ability to create, edit or delete chat messages (edit and delete limited to msg owner) and see that reflected in all chat instances.
* Basic support for speech recognition (Chrome only at present.)

Test client
-----------
There is a basic end-to-end test client implemented using the [Nightwatch](http://nightwatchjs.org/) framework.  This is currently set to run a suite of tests in the Chrome browser.  At present this has only been run in MS Windows 10, should you have any difficulties please contact me. 

1. Ensure that Chrome, node and npm are installed.
2. Navigate to the /testing folder.
3. Install Nightwatch by running "npm install nightwatch"
4. Install Chromedriver by running "npm install chromedriver"
5. Run "node nightwatch.js"
