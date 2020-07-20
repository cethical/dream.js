const { Client } = require('../src');
const path = require('path');

let inhibitorPath = path.join(__dirname, 'inhibitors');
let commandPath = path.join(__dirname, 'commands');
let eventPath = path.join(__dirname, 'events');

const client = new Client({
    token: 'NzIzODQ1MTk2MDU1MzE0NTIy.XxOJ9w.co-f1qWeb2xpBtcH-VKtugCi9Pg',
    dev: ['144187884587450369'],
    prefix: '-',
    typing: true,
    mobile: true,
    activity: {
        type: 'LISTENING',
        name: (client) => `${client.prefix}help`
    },

    inhibitorPath,
    commandPath,
    eventPath
});

client.login();