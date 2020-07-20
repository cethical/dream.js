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