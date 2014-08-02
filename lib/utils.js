
if (typeof define !== 'function') { 
	var define = require('amdefine')(module);
	var requirejs = require('requirejs');
}

define(function() { 

	return { 

		toCamelCase: function(str) { 
	        return str.replace(/-([a-z])/g, function (m, w) {
	            return w.toUpperCase();
	        });
	    },

		capitalize : function(obj) { 
			str = (obj == null||obj == undefined) ? '' : obj.toString();
			return str.charAt(0).toUpperCase() + str.slice(1);
		},

	    titleize: function(obj) { 
			if (obj == null) return '';
			return obj.toString().replace(/(?:^|\s)\S/g, function(c){ return c.toUpperCase(); });
	    },

		underscored: function(obj) { 
			if(obj == null) return '';
			return obj.toString().trim().replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
		},

	    humanize: function(obj) { 
	    	if(obj == null) return '';
	    	var s1 = this.capitalize(obj.toString());
	    	return this.underscored(s1).replace(/_id$/,'').replace(/_/g, ' ');
	    },

	    toDashed: function(str) { 
	        return str.replace(/([a-z][A-Z])/g, function (m) {
	            return m[0] + '-' + m[1].toLowerCase()
	        });
	    },

	    getURLParameter: function(name, href) { 
			var regex  = RegExp(name + '=' + '(.+?)(&|$)');
			var url = (href!==undefined) ? href : location.href;
			var match = href.match(regex);
			var result = (match !== null) ? match[1] : null;
			return (result === null) ? null : decodeURIComponent(result.replace(/\+/g, " "));
        },

		getType: function(obj) { 
			var s = typeof obj;
			if (s === 'object') { 
				if (obj) { 
					if (typeof obj.length === 'number' && !(obj.propertyIsEnumerable('length')) && typeof obj.splice === 'function') { 
						return 'array';
					}
				}
				else
					return 'null';
			}
			return s;
		},

        isInteger: function(maybeInteger) { 
            return ((maybeInteger - 0) === parseInt(maybeInteger));
        },

		isValidJSON: function(json) { 
			try { 
				var testObject = JSON.parse(json);
			}
			catch(err) { 
				return false;
			}
			return true;
		},

		isHTTPServer: function() { 
			return (location.protocol=="https:" || location.protocol=="http:")
		},

		host: location.protocol + '//' + location.host,

		inspectToHTML: function(obj) { 
			return this.inspect(obj,true);
		},

		inspectToString: function(obj) { 
			return this.inspect(obj,false);
		},

		supplant: function (templ, obj) { // doug crockford's version
		    return templ.replace(/{([^{}]*)}/g, function (a, b) { 
		    	var r = obj[b];
	            return typeof r === 'string' || typeof r === 'number' ? r : a;
	        });
		},

		queryStringObj: function(url) { 
			var qsObj = {};
			url.replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"), function($0, $1, $2, $3) { qsObj[$1] = $3; });
			var urlPath = window.location.href.substr(0,window.location.href.indexOf('?'));
			delete qsObj[urlPath];
			return qsObj;
		},

		absPath: function(url) { 
			return window.location.pathname + url;
		},

		guid: function(start) { 
			var start = (start===undefined) ? "id" : start;
			var fourChars = function() { return (((1 + Math.random()) * 0x10000)|0).toString(16).substring(1).toUpperCase(); };
    		return (start + fourChars() + fourChars() + "-" + fourChars() + "-" + fourChars() + "-" + fourChars() + "-" + fourChars() + fourChars() + fourChars());
		},

		inspect: function(obj, html) { 
			var str = '', type, msg;
			var level = 0;
			var maxLevels = 10;
			if(maxLevels < 1) return 'Error: Object levels must be greater than 0';
			if(obj == null) return 'Error: Object was null';
			str += '<ul>';
			for(var field in obj) { 
				try { 
					type =  this.getType(obj[field]);
					str += '<li>[' + type + '] ' + field + ' : ' + ((obj[field]==null)?(': <b>null</b>'):(obj[field])) + '</li>';
					if(((type == 'object')||(type == 'array')) && (obj[field] != null) && (level+1 < maxLevels))
						str += this.inspect(obj[field], maxLevels, level+1, html);
				}
				catch(err) { 
					str += '<li>Error: [' + field + '] : ' + err.toString() +'</li>';
				}
			}
			str += '</ul>';
			if(!html) str = str.replace(/<.+?>/g,'');
			return str;
		},

		jsToFormField: function(jsObj, name, id, size) { 
		    var jsonType = this.getType(jsObj);
		    var id = id || "";
		    var size = size || 50;
		    var name = name || "";
		    var inputTextTemplate = '<input type="{type}" jsontype="{jsonType}" name="{name}" id="{id}" size="{size}" value="{value}" />';
		    var inputCheckboxTemplate = '<input type="checkbox" jsontype="{jsonType}" name="{name}" id="{id}" {checked} />';
		    switch(jsonType) { 
		        case "string" :
		        	var data = { type: 'text', jsonType: jsonType, name: name, id: id, size: size, value: jsObj};
		            return this.supplant(inputTextTemplate, data);
		            break;
		        case "number" :
		        	var data = { type: 'text', jsonType: jsonType, name: name, id: id, size: size, value: jsObj};
		            return this.supplant(inputTextTemplate, data);
		            break;
		        case "boolean" :
		        	var data = { jsonType: jsonType, name: name, id: id, checked: null };
		            if(jsObj === true) {
		            	data.checked = 'checked';
		            	return this.supplant(inputCheckboxTemplate, data);
		            }
		            else {
		            	data.checked = '';
			            return this.supplant(inputCheckboxTemplate, data);
			        }
		            break;
		        default:
		    		return "error - no element found for type of " + jsonType;
		    }
		}

	};

});