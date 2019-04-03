const hash = require('string-hash')
const moment = require('moment');

module.exports = class Message {
    constructor(arr) {
        [, this._id, this._no, this._msg] = arr;
        this._id = moment(this._id, 'M/D/YY, h:m A');
        if (!this._id.isValid()) {
            console.log(arr);
            throw new Error(arr[1])
        }
        if (!this._msg) {
            this._msg = this._no;
            this._no = ""
        }
    }

    get id() {
        return this._id.format('YYMMDDHHmm')
    }

    get dt() {
        return this._id.format('DD-MMM-YYYY HH:mm')
    }

    get index() {
        return this._id.format("YYMM") + '.json'
    }

    get no() {
        return this._no
    }

    get msg() {
        return this._msg
    }

    get msgHash() {
        return hash(this._msg)
    }

    static fromJSON(obj) {
        return new Message(["", moment(obj.id, 'YYMMDDHHmm').format('M/D/YY, h:m A'), obj.no, obj.msg])
    }

    append(msg) {
        this._msg += '\r\n' + msg
    }

    toJSON() {
        const json = {};
        ['id', 'dt', 'no', 'msg', 'msgHash'].forEach(prop => json[prop] = this[prop]);
        return json
    }
};
