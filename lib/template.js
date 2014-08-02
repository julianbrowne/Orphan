
if (typeof define !== 'function') { 
    var define = require('amdefine')(module);
}

define([ 
        'templates/ejs/factory', 
        'templates/mustache/factory', 
        'templates/dynamic/factory'
    ], 
    function(Ejs, Mustache, Dynamic) { 
        function Template() { 
            this.ejs = new Ejs();
            this.mustache = new Mustache();
            this.dynamic = new Dynamic();
        };
        return new Template();
    }
);