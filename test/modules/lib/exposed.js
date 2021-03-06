var events = require('events')

var Exposed = module.exports = function(data, id, peer) {
	//
	this.id = data.id;
	this.method = data.method;
	this.params = data.params;
	this.peerId = peer.id;
	this.peer = peer;

	//
	this.result = {};
	this.err = {};
	this.hasSent = false;
};

Exposed.prototype.send = Exposed.prototype.end = function() {
	if(this.hasSent) {
		throw new Error('should not sent twice.');
	}
	if(arguments.length >= 1) {
		this.set(arguments[0], arguments[1]);
	}
	this.peer.send({
		type : 'rpc',
		data : {
			id : this.id,
			result : this.result,
			error : this.err['code'] ? this.err : null
		}
	});
	this.hasSent = true;
	return this;
};
Exposed.prototype.add = Exposed.prototype.set = function(key, val) {
	this.result[key] = val;
	return this;
};
Exposed.prototype.broadcast = function(method, parmas, callBack) {
	this.peer.servent.broadcastInvoke(method, parmas, callBack);
	return this;
};
Exposed.prototype.get = function(key) {
	return this.result[key];
};
Exposed.prototype.error = function(msg, code) {
	this.err = {
		message : msg,
		code : code || 1000,
		method : this.method,
		params : this.params
	};
	return this.send();
};
