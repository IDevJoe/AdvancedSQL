let AdvancedSQL = require('./index');

class Condition {
    constructor(name, symbol, value) {
        this.name = name;
        this.symbol = symbol;
        this.value = value;
    }

    toString(structure) {
        let th = this;
        let col = structure.cols.find(function(e) {
            return e.coldata.name === th.name;
        });
        return `${this.name} ${this.symbol} ${AdvancedSQL.connection.escape(col.toDB(this.value))}`
    }
}

module.exports = Condition;