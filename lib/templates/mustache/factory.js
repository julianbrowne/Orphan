
if (typeof define !== 'function') { 
    var define = require('amdefine')(module);
}

define(['./mustache','../ejs/ejs'], function(Mustache, Ejs) { 
    function MustacheObj() { 
        this.create = function(url) { 
            var template = Ejs.request(url);
            var tmplObj = function(tmpl) { 
                this.render = function(data) { 
                    Mustache.parse(tmpl);
                    console.log(tmpl);
                    return Mustache.render(tmpl, data);
                };
            };
            return new tmplObj(template);
        };
    };
    return MustacheObj;
});