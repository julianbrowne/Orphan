
if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}

define(['utils', 'error'], function(utils, Error) { 

	function Orphan(base) { 
		if(!utils.isHTTPServer()) throw new Error.BrowserError();
		var orphan = this;
		this.base = base;
		this.Request = function(method, url, callback) { 
			var request = this;
			this.body = '';
			this.xmlhttp = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
			this.xmlhttp.onreadystatechange=function() { 
				//console.log(request.xmlhttp.readyState);
				if (request.xmlhttp.readyState==4) { 
					if(request.xmlhttp.status>=200&&request.xmlhttp.status<=299)
						callback(request.xmlhttp.responseText);
					else { 
						console.log(request.xmlhttp.status);
						console.log(request.xmlhttp.responseText);
					}
				}
			};
			this.headers = { 
				"Content-type": "application/json"
				//"Origin": location.origin
			}
			this.url = (orphan.base + url).replace(/([^:])\/\//g, "$1\/");
			this.send = function() { 
				request.xmlhttp.open(method.toUpperCase(), this.url, true);
				Object.keys(request.headers).forEach(function(header) { 
					request.xmlhttp.setRequestHeader(header,request.headers[header]);
				});
				request.xmlhttp.send();
			}
		};
	};

	Orphan.prototype.get = function(url, callback) { 
		new this.Request('get', url, callback).send();
	};

	Orphan.prototype.post = function(url, body, callback) { 
		var r = new this.Request('post', url, callback);
		r.body = body;
		r.send();
	};

	Orphan.prototype.put = function(url, body, callback) { 
		var r = new this.Request('put', url, callback);
		r.body = body;
		r.send();
	};

	Orphan.prototype.delete = function(url, callback) { 
		new this.Request('delete', url, callback).send();
	};

	return Orphan;

});