const { Inhibitor } = require('../');

module.exports = class extends Inhibitor {
    constructor(...args) {
        super(...args, {
            name: 'cooldown'
        });
    }

    run(msg, args, cmd) {
        let cooldown = cmd.cooldowns.get(msg.author.id);
        let timeLeft = ((cooldown.start + cmd.cooldown - Date.now()) / 1000);

        if (cooldown) throw `You have \`${timeLeft.toFixed(1)}s\` left before using **${cmd.name}**`
    }
}