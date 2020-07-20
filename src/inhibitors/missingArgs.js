const { MessageEmbed } = require('discord.js');
const { Inhibitor } = require('../');

module.exports = class extends Inhibitor {
    constructor(...args) {
        super(...args, {
            name: 'missingArgs'
        });
    }

    run(msg, args) {
        if (!args.length)
            throw new MessageEmbed()
                .setDescription('Missing arguments')
    }
}