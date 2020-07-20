const { Command } = require('../../');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'help',
            description: 'Displays all commands.'
        });
    }

    run(msg) {
        const { commands } = this.client;
        
        const cmdMap = commands.map(command => {
            return `${command.name}: ${command.description}`
        });

        msg.channel.send(cmdMap);
    }
}