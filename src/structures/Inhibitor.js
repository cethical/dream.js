module.exports = class Inhibitor {
    constructor(client, options) {
        this.client = client;

        this.name = options.name || '';
    }
}