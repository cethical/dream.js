module.exports = class Handler {
    constructor(client) {
        this.client = client;

        client.on('message', this._handleMsg.bind(this));
    }

    async _handleMsg(msg) {
        const { prefix, commands, inhibitors } = this.client;
        let mentioned = msg.mentions.users.first();

        if (!this.client.selfbot && mentioned == this.client.user) {
            let command = commands.find(x => x.name.toLowerCase().includes('help'));

            if (command) return command.run(msg);
        }

        if (!this._validate(msg)) return;

        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
        const trigger = args.shift().toLowerCase();
        const cmd = commands.find(x => x.name == trigger || x.aliases.includes(trigger));

        if (!cmd) return;

        try {
            if (this.client.typing) msg.channel.startTyping();

            if (cmd.inhibitors && cmd.inhibitors.length > 0) {
                for (let cmdInhibitor of cmd.inhibitors) {
                    let inhibitor = inhibitors.find(x => x.name == cmdInhibitor);
                    if (!inhibitor) continue;

                    let response = await inhibitor.run(msg, args, cmd);
                    if (response) return msg.channel.send(response);
                }
            }

            let cooldown = cmd.cooldowns.get(msg.author.id);
            let inhibitor = inhibitors.find(x => x.name.toLowerCase().includes('cooldown'));

            if (cmd.guildOnly && !msg.guild) return;
            if (cmd.cooldown && cooldown && inhibitor) inhibitor.run(msg, args, cmd);

            if (!this.client.selfbot && !cooldown) {
                cmd._setCooldown(msg.author.id);
            }

            await cmd.run(msg, args);
        } catch (e) {
            await msg.channel.send(e);
        } finally {
            if (this.client.typing) msg.channel.stopTyping();
        }
    }

    async _validate(msg) {
        if (this.client.selfbot && msg.author.id != this.client.user.id) return;

        if (msg.author.bot) return false;
        if (!msg.content.startsWith(this.client.prefix)) return false;

        return true;
    }
}