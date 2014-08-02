
if (typeof define !== 'function') { 
    var define = require('amdefine')(module);
}

define(['./ejs'], function(Ejs) { 
    function EjsObj() { 
        this.create = function(url) { return new Ejs({url: url}); };
    };
    return EjsObj;
});