const AdvancedSQL = require('./index');
const WhereStack = require('./WhereStack');

class Table {
    constructor(name) {
        this.name = name;
        this.cols = [];
        this.id_field = "id";
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
                    tbl.id_field = th.id_field;
                    result = JSON.parse(JSON.stringify(result));
                    for(let key of Object.keys(result)) {
                        tbl.cols.push(key);
                        tbl[key] = result[key];
                    }
                    resl.push(tbl);
                });
                res(resl);
            };
            if(conditions.length === 0)
                AdvancedSQL.connection.query("SELECT * FROM "+AdvancedSQL.connection.escapeId(th.name), finishFunction);
            else if(conditions.length === 1)
                AdvancedSQL.connection.query("SELECT * FROM "+AdvancedSQL.connection.escapeId(th.name)+" WHERE "+conditions[0].toString(), finishFunction);
            else {
                let conditionString = conditions[0].toString();
                for(let i=1;i<conditions.length;i++) {
                    conditionString += " AND "+conditions[i].toString();
                }
                AdvancedSQL.connection.query("SELECT * FROM "+AdvancedSQL.connection.escapeId(th.name)+" WHERE "+conditionString, finishFunction);
            }
        });
    }
    populate() {

    }
    save() {
        let th = this;
        return new Promise(function(res, rej) {
            let finishFunction = function(error, results) {
                if(error) return rej(error);
                if(results.insertId != null) th[th.id_field] = results.insertId;
                res();
            };
            if(th[th.id_field] === undefined) {
                let str1 = "";
                let str2 = "";
                th.cols.forEach((e) => {
                    str1 += ", "+AdvancedSQL.connection.escapeId(e);
                    str2 += ", "+AdvancedSQL.connection.escape(th[e]);
                });
                str1 = "("+str1.substr(2)+")";
                str2 = "("+str2.substr(2)+")";
                AdvancedSQL.connection.query("INSERT INTO "+AdvancedSQL.connection.escapeId(th.name)+" "+str1+" VALUES"+str2, finishFunction);
            } else {
                let str = "";
                th.cols.forEach((e) => {
                    str += ", "+AdvancedSQL.connection.escapeId(e)+"="+AdvancedSQL.connection.escape(th[e]);
                });
                str = str.substr(2);
                AdvancedSQL.connection.query("UPDATE "+AdvancedSQL.connection.escapeId(th.name)+" SET "+str+" WHERE "+AdvancedSQL.connection.escapeId(th.id_field)+"=?", [th[th.id_field]], finishFunction);
            }
        });
    }
}

module.exports = Table;