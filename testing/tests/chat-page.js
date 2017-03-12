/* jshint expr: true */
module.exports = {
  tags: ['chat-page'],
  'Chat main page testing' : function (client) {
    client
      .url('localhost:3000')
      .pause(1000);

    client.expect.element('body').to.be.present;

    client.end();
  }
};
