
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() { 

    return { 

        BrowserError: function() { 
            this.name = "browser error";
            this.message = "must be run from inside a browser window";
        }

    }
    
});