
var Orphan;

requirejs.config({ 
    baseUrl: '/lib/',
    paths: { 
        "orphan": "orphan",
        "utils": "utils",
        "error": "error"
    }
});

requirejs([ 
        'orphan', 
        'utils', 
        'ui', 
        'markdown/converter',
        'template'
    ],
    function(orphan, utils, ui, markdown, template) { 
        console.log("loaded orphan");
        Orphan = orphan;
        Orphan.utils = utils;
        Orphan.ui = ui;
        Orphan.markdown = markdown;
        Orphan.template = template;
    }
);