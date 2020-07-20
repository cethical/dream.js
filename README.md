# Dream Services | Discord.JS Framework

A simple to use [discord.js](https://discord.js.org/) framework, easy to create commands, events & inhibitors. Automatically handles messages and everything else you'd usually include.

> Inspired by coolcaedframework  

## Creating a Client
Creating the client that will run everything you don't need to code anymore.

Name | Type | Description
-----|------|------
commandPath | String | The command directory *
eventPath | String | The event directory
inhibitorPath | String | The inhibitor directory
selfbot | Boolean | Connect your user account
mobile | Boolean | Displays the mobile indicator for your bot
dev | Array | Change to string if selfbot is true
token | String | The bot token *
prefix | String | The prefix for the bot *
activity | Object | Status for the bot
activity.name | String | The status message
activity.type | String | The status type, has to be uppercased
activity.url | String | The status url for the streaming type
activity.status | String | The status

```js
const { Client } = require('dream.js');
const path = require('path');

let inhibitorPath = path.join(__dirname, 'inhibitors');
let commandPath = path.join(__dirname, 'commands');
let eventPath = path.join(__dirname, 'events');

const client = new Client({
    inhibitorPath, // Inhibitor directory
    commandPath, // Command directory
    eventPath, // Event directory

    selfbot: false, // Connect your user account
    mobile: false, // Displays the mobile indicator for your bot
    typing: false, // Makes the bot type when executing a command

    activity: { // Status for the bot
        name: (client) => `${client.prefix}help`, // Works without a function
        status: "online", // online, idle, dnd or invisible
        type: "STREAMING", // STREAMING, WATCHING, PLAYING or LISTENING
        url: "https://twitch.tv/ " // For STREAMING type
    },

    readyMsg: (client) => `Connected as ${client.user.tag}`, // Not required, also works without the function

    dev: [], // If selfbot is enabled you don't need the array
    token: "", // The token for the bot
    prefix: "", // The prefix for the bot
});

client.login();
```

## Creating a Command 
Creating a command with dream.js

Name | Type | Description
-----|------|------
name | String | The command name *
description | String | The command description
usage | String | The command usage
inhibitors | Array | Put all inhibitor names in here
aliases | Array | The command aliases
cooldown | Number | Prevents spam
guildOnly | Boolean | Disable DM commands
del | Boolean | Deletes the command message

```js
const { Command } = require('dream.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'ping', // The command name
            description: 'Ping pong...', // The command description
            usage: '<missing arguments>', // The command usage
            inhibitors: ['cooldown'], // Put all inhibitor names in here
            aliases: ['pong'], // The command alias, can be added more
            cooldown: 3, // Command cooldown, doesn't need to be included in inhibitors
            guildOnly: true, // Disable DM commands
            del: false // Deletes the command message
        });
    }

    run(msg) {
        msg.channel.send('pong');
    }
}
```

## Creating a Event
Creating a event with dream.js

Name | Type | Description
-----|------|------
name | String | The event name *

```js
const { Event } = require('dream.js');

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: 'guildMemberAdd' // The event name
        });
    }

    run(member) {
        const welcomeChannel = member.guild.channels.cache.get('12345678901234568');

        welcomeChannel.send(`Welcome ${member}!`);
    }
}
```

## Creating a Inhibitor
Creating a inhibitor with dream.js

Name | Type | Description
-----|------|------
name | String | The inhibitor name *

```js
const { Inhibitor } = require('dream.js');

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
            name: 'missingArgs' // The inhibitor name
        });
    }

    run(msg, args, cmd) {
        if (!args.length) throw 'Missing arguments.';
    }
}
```

created by matt