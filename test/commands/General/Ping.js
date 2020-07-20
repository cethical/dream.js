const { Command } = require('../../../src');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'ping',
            description: 'ping pong'
        });
    }

    run(msg) {
        msg.channel.send('pong');
    }
}