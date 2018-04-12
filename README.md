# AdvancedSQL
Transforms MYSQL into an object-based system

## Installation
Since this package is not posted on npm, use `npm i --save idevjoe/advancedsql` to install it.

## Known Issues
- **Babel:** I have found some serious problems with trying to run certain compiled classes that extend `AdvancedSQL.Table`. Compile it with babel at your own risk, but you should be aware that it is a known issue.

### Other bugs
Since this is fairly new, **please** submit bugs/issues under the issues tab and I'll try my best to fix them.

## Usage

### Structures
To start, you'll need a table structure file which I usually store in a folder named `structures`.

```js
let AdvancedSQL = require('advancedsql');

class Reservation extends AdvancedSQL.Table {
    constructor() {
        super("reservations");
        this.structure.pkey('id');
        this.structure.string('type');
        this.structure.int('occupants');
        this.structure.bool('paid');
        this.structure.bool('checked_in');
    }
}

module.exports = Reservation;
```

- First, we start by creating the class
- In the constructor, the parameter to `super` is the table name you'll be using
- `this.structure` calls generates the structure for the table. If your real table and class do not match, it will throw an error.
  - Accepted types: `pkey`, `int`, `string`, `longtext`, `json`, `bool`
 
### Connecting AdvancedSQL to MYSQL
You connect AdvancedSQL to the MYSQL server as you would with the normal mysql library using `AdvancedSQL.connect(options, pool)`.

- **options** - An object of options, as defined [here](https://www.npmjs.com/package/mysql#connection-options). *Required*
- **pool** - Boolean of if the connection is to be a pooled connection. *Default: false*

## Examples

### Creating a new row
```js
let reservation = new Reservation();
reservation.type = "ROOM";
reservation.occupants = 1;
reservation.paid = true;
reservation.checked_in = false;
reservation.save();
```

### Updating rows
```js
let reservation = new Reservation();
reservation.id = 1;
reservation.populate();
reservation.occupants = 2;
reservation.save();
```

### Getting all rows
```js
let defaultReservation = new Reservation();
defaultReservation.get().then((e) => {
   // e is an array of reservations
});
```

### Getting all rows where...
```js
let defaultReservation = new Reservation();
defaultReservation.where('type', '=', 'ROOM').where('paid', '=', true).get().then((e) => {
   // e is an array of reservations where a paid room is booked
});
```

### Deleting
```js
let reservation = new Reservation();
reservation.id = 1;
reservation.populate();
reservation.delete();
```
 
