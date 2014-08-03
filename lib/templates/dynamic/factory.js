
if (typeof define !== 'function') { 
    var define = require('amdefine')(module);
}

define(['../../utils', './utils', '../../ui'], function(orphanUtils, utils, ui) { 

    function DynamicTemplateManager() { 

        this.create = function(config) { 

            var DynamicTemplate = function() { 

                this.render = function(obj) { return generateHTML(obj) };

                function generateHTML(jsObj, parent, html, level) { 

                    var parent = (parent === undefined) ? null  : parent;
                    var html   = (html   === undefined) ? ''    : html;
                    var level  = (level  === undefined) ? 0     : level;

                    for(var field in jsObj) { 
                        var field_value = jsObj[field];
                        var field_type  = orphanUtils.getType(field_value);
                        var field_name  = utils.generateFieldName(field, parent);

                        if(field_type === 'object' || field_type === 'array') { 

                            var folder = new utils.Folder(field, field_type);
                            var listID = orphanUtils.guid('items-' + field + '-');

                            console.log(folder);
                            console.log(field_value.length);

                            if(field_value.length === 0) { 
                                html += utils.emptyFolder(folder);
                            }
                            else { 
                                if(field === config.links) { 
                                    html += "<fieldset>";
                                    html += "<legend>links</legend>";
                                    jsObj[field].forEach(function(link) { 
                                        console.log(link);
                                        html += utils.Link(link[config.href.field], link[config.href.text]);
                                    });
                                    html += "</fieldset>";
                                }
                                else { 
                                    html += "<fieldset>";
                                    html += "<legend>" + folder.key + "</legend>";
                                    html = generateHTML(field_value, field_name, html, level);
                                    html += "</fieldset>";
                                }
                            }

                        }
                        else { 

                            var element = new utils.Element();

                            if(ctr===undefined)
                                var ctr = 0;
                            else
                                ctr++;

                            element.type        = field_type;
                            element.key         = orphanUtils.isInteger(field) ? '[' + ctr + ']' : field;
                            element.value       = field_value;
                            element.fieldName   = field_name;
                            element.fieldLength = '30';

                            switch(field) { 
                                case config.image.field:
                                    element.src = utils.Image('a', 'b');
                                    break;
                                default:
                                    element.src = utils.Marker(orphanUtils.titleize(element.key), element.value);
                            }

                            html += "<dl>";
                            html += element.src;
                            //html += "<dt><label for=\"" + element.fieldName + "\">" + orphanUtils.titleize(element.key) + "</label></dt>";
                            //html += "<dd>" + orphanUtils.jsToFormField(element.value, element.fieldName) + "</dd>";
                            html += "</dl>";
                        }
                    }
                    
                    return html;
                };

            };

            return new DynamicTemplate();
        };
    }
    return DynamicTemplateManager;
});