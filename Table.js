const AdvancedSQL = require('./index');
const WhereStack = require('./WhereStack');
const DBStructure = require('./DBStructure');

class Table {
    constructor(name) {
        this.name = name;
        this.structure = new DBStructure();
        this.v = false;
    }
    pkey() {
        return this.structure.cols.find(function(e) {
            return e.coldata.primary;
        });
    }
    where(name, symbol, value) {
        let condition = new AdvancedSQL.Condition(name, symbol, value);
        let ws = new WhereStack();
        ws.stack = [condition];
        ws.parent_get = this.get.bind(this);
        return ws;
    }
    get(conditions = []) {
        let th = this;
        return new Promise(function(res, rej) {
            let finishFunction = function(error, results) {
                if(error) return rej(error);
                let resl = [];
                results.forEach(function(result) {
                    let tbl = new Table(th.name);
                    tbl.v = true;
                    tbl.structure = th.structure;
                    for(let key of Object.keys(result)) {
                        tbl[key] = th.structure.cols.find(function(e) {return e.coldata.name === key}).fromDB(result[key]);
                    }
                    resl.push(tbl);
                });
                res(resl);
            };
            if(conditions.length === 0)
                AdvancedSQL.connection.query("SELECT * FROM "+AdvancedSQL.connection.escapeId(th.name), finishFunction);
            else if(conditions.length === 1)
                AdvancedSQL.connection.query("SELECT * FROM "+AdvancedSQL.connection.escapeId(th.name)+" WHERE "+conditions[0].toString(th.structure), finishFunction);
            else {
                let conditionString = conditions[0].toString(th.structure);
                for(let i=1;i<conditions.length;i++) {
                    conditionString += " AND "+conditions[i].toString(th.structure);
                }
                AdvancedSQL.connection.query("SELECT * FROM "+AdvancedSQL.connection.escapeId(th.name)+" WHERE "+conditionString, finishFunction);
            }
        });
    }
    populate() {
        let th = this;
        let pk = this.pkey();
        return new Promise(function(res, rej) {
            AdvancedSQL.connection.query("SELECT * FROM "+AdvancedSQL.connection.escapeId(th.name)+" WHERE "+AdvancedSQL.connection.escapeId(th.pkey().coldata.name)+"=?", [pk.toDB(th[pk.coldata.name])], function(error, results) {
                if(error) return rej(error);
                if(results.length !== 1) return res();
                for(let key of Object.keys(results[0])) {
                    th[key] = th.structure.cols.find(function(e) {return e.coldata.name === key}).fromDB(results[0][key]);
                }
                th.v = true;
                res();
            });
        });
    }
    valid() {
        return this.v && this[this.pkey().coldata.name] !== undefined;
    }
    save() {
        let th = this;
        let pk = this.pkey();
        return new Promise(function(res, rej) {
            let finishFunction = function(error, results) {
                if(error) return rej(error);
                if(th[pk.coldata.name] === undefined && results.insertId != null) th[pk.coldata.name] = results.insertId;
                th.v = true;
                res();
            };
            if(th[th.pkey().coldata.name] === undefined) {
                let str1 = "";
                let str2 = "";
                th.structure.cols.forEach((e) => {
                    str1 += ", "+AdvancedSQL.connection.escapeId(e.coldata.name);
                    str2 += ", "+AdvancedSQL.connection.escape(e.toDB(th[e.coldata.name]));
                });
                str1 = "("+str1.substr(2)+")";
                str2 = "("+str2.substr(2)+")";
                AdvancedSQL.connection.query("INSERT INTO "+AdvancedSQL.connection.escapeId(th.name)+" "+str1+" VALUES"+str2, finishFunction);
            } else {
                let str = "";
                th.structure.cols.forEach((e) => {
                    str += ", "+AdvancedSQL.connection.escapeId(e.coldata.name)+"="+AdvancedSQL.connection.escape(e.toDB(th[e.coldata.name]));
                });
                str = str.substr(2);
                AdvancedSQL.connection.query("UPDATE "+AdvancedSQL.connection.escapeId(th.name)+" SET "+str+" WHERE "+AdvancedSQL.connection.escapeId(pk.coldata.name)+"=?", [pk.toDB(th[pk.coldata.name])], finishFunction);
            }
        });
    }
    delete() {
        let th = this;
        let pk = this.pkey();
        return new Promise(function(res, rej) {
            AdvancedSQL.connection.query("DELETE FROM "+AdvancedSQL.connection.escapeId(th.name)+" WHERE "+AdvancedSQL.connection.escapeId(pk.coldata.name)+"=?", [pk.toDB(th[pk.coldata.name])], function(error) {
                if(error) return rej(error);
                th.v = false;
                res();
            });
        });
    }
}

module.exports = Table;