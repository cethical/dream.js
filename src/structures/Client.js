const Handler = require('./Handler');

const { Client, Collection, Constants } = require('discord.js');
const { connect } = require('mongoose');

const path = require('path');
const fs = require('fs');

let { properties } = Constants.DefaultOptions.ws;

module.exports = class Angel extends Client {
    constructor(options) {
        if (!options.token) {
            throw new Error('options.token is an essential requirement.');
        }

        if (!options.prefix) {
            throw new Error('options.prefix is an essential requirement.');
        }

        if (!fs.existsSync(options.commandPath)) {
            throw new Error('Command directory is an essential requirement.');
        }

        if (options.selfbot && typeof !options.selfbot == Boolean) {
            throw new TypeError('options.selfbot has to be boolean.');
        }

        if (options.mobile && typeof !options.mobile == Boolean) {
            throw new TypeError('options.mobile has to be boolean.');
        }

        if (options.typing && typeof !options.typing == Boolean) {
            throw new TypeError('options.typing has to be boolean.');
        }

        if (options.selfbot && options.typing) {
            throw new Error('options.selfbot & options.typing cannot both be enabled.');
        }

        if (options.selfbot && options.mobile) {
            throw new Error('options.selfbot & options.mobile cannot both be enabled.');
        }

        if (options.mobile && ['dnd', 'idle', 'invisible'].includes(options.activity.status)) {
            throw new Error('options.mobile only works when the bot has a green status.');
        }

        if (options.selfbot && Array.isArray(options.dev)) {
            throw new Error('options.selfbot only requires 1 owner.');
        }

        if (!options.selfbot && !Array.isArray(options.dev)) {
            throw new Error('options.dev has to be a array if options.selfbot is false.');
        }

        super(options.essentials ? options.essentials : {});

        if (options.mobile) properties.$browser = "Discord Android";
        if (options.selfbot) {
            super._tokenType = "";
            this.rest.tokenPrefix = "Bearer";
        }

        this.selfbot = options.selfbot || false;
        this.mobile = options.mobile || false;

        this.dev = options.dev;
        this.token = options.token;
        this.prefix = options.prefix;
        this.activity = options.activity;
        this.readyMsg = options.readyMsg;
        this.typing = options.typing;

        this.inhibitorPath = options.inhibitorPath;
        this.commandPath = options.commandPath;
        this.eventPath = options.eventPath;

        this.inhibitors = new Collection();
        this.commands = new Collection();
        this.events = new Collection();
        this.handler = new Handler(this);

        super.once('ready', this._readyFixes.bind(this));

        this._loadCommands();
        this._loadInhibitors();
        this._loadEvents();
    }

    async _readyFixes() {
        if (this.selfbot || this.selfbot && !this.dev) {
            return this.dev = this.user.id;
        }

        let activityName = typeof this.activity.name == 'function'
            ? this.activity.name(this)
            : this.activity.name

        this.user.setPresence({
            activity: {
                name: activityName,
                type: this.activity.type,
                url: this.activity.url
            },

            status: this.activity.status
        });

        let readyMsg = !this.readyMsg
            ? `[INIT] [Client.js] Connected as ${this.user.username} (${this.user.id})`
            : typeof this.readyMsg == 'function'
                ? this.readyMsg(this)
                : this.readyMsg

        console.log(readyMsg);
    }

    async _loadCommands() {
        return fs.readdir(this.commandPath, async (err, dir) => {
            if (err) throw new Error(err);

            if (!dir.length) return new Error("Creating a command is essential.");

            dir = fs.readdirSync(this.commandPath).filter(x => fs.statSync(this.commandPath + `/${x}`).isDirectory());

            if (!dir.length) return;

            let aliases = [];

            for (let dirName of dir) {
                let subDir = fs.readdirSync(this.commandPath + `/${dirName}`).filter(file => file.endsWith('.js'));

                await subDir.forEach(async file => {
                    const pull = require(this.commandPath + `/${dirName}/${file}`);
                    const command = new pull(this);

                    if (this.commands.has(command.name)) {
                        throw new Error(`${command.name} is already a registered command name.`);
                    } else {
                        this.commands.set(command.name, command);
                    }

                    if (command.aliases.length > 0) {
                        for (let alias of command.aliases) {
                            let isDupe = aliases.includes(alias);

                            if (isDupe) throw new Error(`${command.name} alias: ${alias} is already a registered alias.`);

                            await aliases.push(alias);
                        }
                    }
                });

                aliases = [];

                console.log(`[INIT] [Client.js] [${dirName}] Loaded: ${subDir.length} ${subDir.length < 1 ? 'commands' : 'command'}`);
            }
        });
    }

    async _loadInhibitors() {
        let inhibitorExists = fs.existsSync(this.inhibitorPath);

        if (!inhibitorExists) this.inhibitorPath = path.join(__dirname, '../inhibitors');

        return fs.readdir(this.inhibitorPath, async (err, files) => {
            if (err) throw new Error(err);

            files = files.filter(x => x.endsWith('.js'));

            if (!files.length) return;

            await files.forEach(file => {
                const pull = require(this.inhibitorPath + `/${file}`);
                const inhibitor = new pull(this);
                const name = inhibitor.name ? inhibitor.name : file.split('.')[0];

                if (this.inhibitors.has(name)) {
                    throw new Error(`${name} already exists within the inhibitor directory.`);
                } else {
                    this.inhibitors.set(name, inhibitor);
                }
            });

            console.log(`[INIT] [CLient.js] Loaded: ${files.length} ${files.length < 1 ? 'inhibitors' : 'inhibitor'}`);
        });
    }

    async _loadEvents() {
        let eventsExists = fs.existsSync(this.eventPath);

        if (!eventsExists) this.eventPath = path.join(__dirname, '../events');

        return fs.readdir(this.eventPath, async (err, files) => {
            if (err) throw new Error(err);

            files = files.filter(x => x.endsWith('.js'));

            if (!files.length) return;

            await files.forEach(file => {
                const pull = require(this.eventPath + `/${file}`);
                const event = new pull(this);
                const name = event.name ? event.name : file.split('.')[0];

                if (this.events.has(name)) {
                    throw new Error(`${name} already exists within the event directory.`);
                } else {
                    this.events.set(name, event);

                    super.on(name, (...args) => event.run(...args));
                }
            });

            console.log(`[INIT] [CLient.js] Loaded: ${files.length} ${files.length < 1 ? 'events' : 'event'}`);
        });
    }

    async login() {
        return super.login(this.token);
    }
}