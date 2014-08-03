
if (typeof define !== 'function') { 
    var define = require('amdefine')(module);
}

define(['../../utils'], function(orphanUtils) { 
    return { 

        generateFieldName: function(field, parent) { 
            if(orphanUtils.isInteger(field))
                return (parent) ? parent + '[' + field + ']' : '[' + field + ']';
            else
                return (parent) ? parent + '.' + field : field;
        },

        Link: function(href, text) { 
            var template='<div><a href="?res={href}">{text}</a></div>';
            return orphanUtils.supplant(template, { href: href, text: text });
        },

        Image: function(src, alt) { 
            var template='<img src="{src}" alt="{alt}"/>';
            return orphanUtils.supplant(template, { src: src, alt: alt });
        },

        Marker: function(key, value) { 
            var template='<div><span>{key}</span>:<span>{value}</span></div>';
            return orphanUtils.supplant(template, { key: key, value: value });
        },

        Div: function(text) { 
            var template='<div>{text}</div>';
            return orphanUtils.supplant(template, { text: text });
        },

        Element: function() { 

        },

        Folder: function(field, type) { 
            this.name = field;
            this.type =  type;
            this.id = orphanUtils.guid('key-');
            if(type === 'object')
                this.key = orphanUtils.isInteger(field) ? '{}' : field;
            else
                this.key = orphanUtils.isInteger(field) ? '[]' : field;
        },

        emptyFolder: function(folder) { 
            return orphanUtils.supplant(this.objectTemplate, { key: folder.key, name: folder.name, type: folder.type });
        },

        objectTemplate: '\
            <fieldset>\
                <legend>{key}</legend>\
                <dl>\
                    <dt><label for="{name}">-</label></dt>\
                    <dd><input jsontype="{type}" type="hidden" name="{name}" value=""></dd>\
                </dl>\
            </fieldset>',

    };
});