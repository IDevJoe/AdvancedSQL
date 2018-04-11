let AdvancedSQL = require('./index');

class WhereStack {
    constructor() {
        this.stack = [];
        this.parent_get = function() {};
    }
    where(name, symbol, value) {
        this.stack.push(new AdvancedSQL.Condition(name, symbol, value));
        return this;
    }
    get() {
        return this.parent_get(this.stack);
    }
}

module.exports = WhereStack;