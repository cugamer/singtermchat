/* jshint expr: true */
module.exports = {
  tags: ['chat-page'],
  'Chat main page testing' : function (client) {
    client
      .url('localhost:3000')
      .pause(1000);

    client.expect.element('body').to.be.present;
    client.expect.element('.online-users').to.be.present;
    client.expect.element('.chat-area').to.be.present;
    client.expect.element('.chat-list').to.be.present;
    client.expect.element('.chat-form').to.be.present;
    client.assert.value('.users-list:first-child .user-text', "guest_0");

    client
      .setValue('.chat-text', 'Lorem ipsum')
      .click('.chat-submit')
      .pause(1000)
      .assert.elementPresent('.chat-list li')
      .assert.value('.chat-list:first-child textarea', 'Lorem ipsum');

      client
        .setValue('.chat-text', 'Ut lobortis')
        .submitForm('form.chat-input')
        .pause(10000)
        .assert.elementPresent('.chat-list:nth-child(2)')
        .assert.value('.chat-list:nth-child(2) textarea', 'Ut lobortis');

    client.end();
  }
};
