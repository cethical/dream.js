const { Collection } = require("discord.js");

module.exports = class Command {
    constructor(client, options) {
        this.client = client;
        this.perms = options.perms;

        this.name = options.name || '';
        this.description = options.description || '';
        this.usage = options.usage || '';
        
        this.inhibitors = options.inhibitors || [];
        this.aliases = options.aliases || [];

        this.guildOnly = options.guildOnly || false;
        this.del = options.del || false;

        this.cooldown = options.cooldown * 1000 || -1;

        this.cooldowns = new Collection();
    }

    async _setCooldown(userID) {
        if (this.cooldown < 1) return null;

        let cooldown = this.cooldowns.get(userID);
        
        if (cooldown) return cooldown;

        this.cooldowns.set(userID, {
            start: Date.now(),
            timeout: setTimeout(() => {
                this.cooldowns.delete(userID);
            }, this.cooldown)
        });
    }
}