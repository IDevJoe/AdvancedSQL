let AdvancedSQL = require('./index');

class Condition {
    constructor(name, symbol, value) {
        this.name = name;
        this.symbol = symbol;
        this.value = value;
    }

    toString() {
        return `${this.name} ${this.symbol} ${AdvancedSQL.connection.escape(this.value)}`
    }
}

module.exports = Condition;