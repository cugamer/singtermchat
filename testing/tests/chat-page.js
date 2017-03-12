/* jshint expr: true */
module.exports = {
  tags: ['chat-page'],
  'Chat main page testing' : function (client) {
    var URL1 = "/";
    var WINDOW1 = client.windowHandle();
    var WINDOW2;

    function openNewWindow() {
      client.execute(function (url1, window1) {
        window.open(url1, window1);
      }, [URL1, WINDOW2]);
    }

    function switchWindow(win) {
      client.windowHandles(function(result) {
        var newWindow = result.value[win]
        this.switchWindow(result.value[win]);
      });
    }

    // Open first window
    client
      .url('localhost:3000')
      .pause(1000);

    // Check page elements
    client.expect.element('body').to.be.present;
    client.expect.element('.online-users').to.be.present;
    client.expect.element('.chat-area').to.be.present;
    client.expect.element('.chat-list').to.be.present;
    client.expect.element('.chat-form').to.be.present;

    // Check for correct username value
    client.assert.value('.users-list:first-child .user-text', "guest_0");
    client.expect.element('.users-list:first-child input').to.not.have.attribute('readonly');

    // Open and switch to second window, check username values
    openNewWindow();
    switchWindow(1);
    client.assert.value('.users-list:first-child .user-text', "guest_0");
    client.assert.value('.users-list li:nth-child(2) .user-text', "guest_1");
    client.expect.element('.users-list:first-child input').to.have.attribute('readonly');
    client.expect.element('.users-list li:nth-child(2) input').to.not.have.attribute('readonly');

    // Switch to first window, update username
    switchWindow(0);
    client
      .clearValue('.users-list:first-child input')
      .setValue('.users-list:first-child input', 'changed 0')
      .submitForm('.users-list:first-child input')
      .expect.element('.users-list:first-child input').value.to.equal('changed 0');

    // Switch to second window, check updated username
    switchWindow(1);
    client.refresh();

    client.expect.element('.users-list:first-child input').value.to.equal('changed 0');

    // In second window post to chat
    client
      .setValue('.chat-text', 'Lorem ipsum')
      .click('.chat-submit')
      .assert.elementPresent('.chat-list li')
      .assert.value('.chat-list:first-child textarea', 'Lorem ipsum');

    client.expect.element('.chat-list:first-child textarea').to.not.have.attribute('readonly');

    client
      .setValue('.chat-text', 'Aenean rutrum')
      .submitForm('form.chat-input')
      .assert.elementPresent('.chat-list li:nth-child(2)')
      .assert.value('.chat-list li:nth-child(2) textarea', 'Aenean rutrum');
    
    client.expect.element('.chat-list li:nth-child(2) textarea').to.not.have.attribute('readonly');

    // Switch to first window, verify new posts
    switchWindow(0);
    client
      .assert.elementPresent('.chat-list li')
      .assert.value('.chat-list:first-child textarea', 'Lorem ipsum');

    client.expect.element('.chat-list:first-child textarea').to.have.attribute('readonly');

    client
      .assert.elementPresent('.chat-list li:nth-child(2)')
      .assert.value('.chat-list li:nth-child(2) textarea', 'Aenean rutrum');
    
    client.expect.element('.chat-list li:nth-child(2) textarea').to.have.attribute('readonly');

    // Switch to second window, edit second post, verify edit
    switchWindow(1);
    client
      .clearValue('.chat-list:first-child textarea')
      .setValue('.chat-list:first-child textarea', 'Donec placerat')
      .submitForm('form.chat-input')
      .expect.element('.chat-list:first-child textarea').value.to.equal('Donec placerat');

    // Switch to first window, verify edit
    switchWindow(0);
    client.refresh();
    client
      .expect.element('.chat-list:first-child textarea').value.to.equal('Donec placerat');

    // Switch to second window, delete first post, verify deletion
    switchWindow(1);
    // client.refresh();
    client
      .click('.chat-list:first-child .delete-msg')
      .expect.element('.chat-list:first-child textarea').value.to.equal('Aenean rutrum');

    // Switch to first window, verify deletion
    switchWindow(0);
    client.refresh();
    client
      .expect.element('.chat-list:first-child textarea').value.to.equal('Aenean rutrum');
    
    // Exit test client
    client.end();
  }
};
