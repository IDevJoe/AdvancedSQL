class Column {
	constructor(parent, name, type, length) {
		this.parent = null;
		this.coldata = {name: name, type: type, length: length, primary: false, notNull: false, unique: false, getValue: (value) => {}};
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
	bool(name) {
		let col = new Column(this, name, "INT", 1);
		col.doldata.getValue = (value) => {
			switch(value) {
				case true:
					return 1;
				case false:
					return 0;
				default:
					return 0;
			}
		}
		this.cols.push(col);
		return col;
	}
}

module.exports = DBStructure;