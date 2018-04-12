class Column {
	constructor(parent, name, type, length) {
		this.parent = null;
		this.coldata = {name: name, type: type, length: length, primary: false, notNull: false, unique: false};
	}
	toDB(value) {
		return value;
	}
	fromDB(value) {
		return value;
	}
	notNull() {
		this.coldata.notNull = true;
		return this;
	}
	primaryKey() {
		this.coldata.primary = true;
		return this;
	}
	unique() {
		this.coldata.unique = true;
		return this;
	}

}
class DBStructure {
	constructor() {
		this.cols = [];
	}
	pkey(name) {
		let col = new Column(this, name, "INT", 11);
		col.notNull().primaryKey().unique();
		this.cols.push(col);
		return col;
	}
	int(name, length = 11) {
		let col = new Column(this, name, "INT", length);
		this.cols.push(col);
		return col;
	}
	string(name, length = 45) {
		let col = new Column(this, name, "VARCHAR", length);
		this.cols.push(col);
		return col;
	}
	longtext(name) {
        let col = new Column(this, name, "LONGTEXT");
        this.cols.push(col);
        return col;
	}
    json(name) {
        let col = new Column(this, name, "LONGTEXT");
        col.toDB = function(value) {
        	return JSON.stringify(value);
		};
        col.fromDB = function(value) {
        	return JSON.parse(value);
		};
        this.cols.push(col);
        return col;
    }
	bool(name) {
		let col = new Column(this, name, "INT", 1);
		col.toDB = function(value) {
			switch(value) {
				case true:
					return 1;
				case false:
					return 0;
				default:
					return 0;
			}
		};
		col.fromDB = function(value) {
            switch(value) {
                case 1:
                    return true;
                case 0:
                    return false;
                default:
                    return false;
            }
		};
		this.cols.push(col);
		return col;
	}
}

module.exports = DBStructure;