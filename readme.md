# Orphan REST Client

Orphan is a pure javascript browser-based client for consuming RESTful services.

## Installation

	git clone https://github.com/julianbrowne/Orphan.git

## Examples

See examples directory for list of ways Orphan can be used.

## Usage

Include require.js and the main loader file:

    <script src="/lib/require.js"></script>
    <script src="/lib/loader.js"></script>

Create a client instance that points to a root location:

	var client = new Orphan('http://localhost/');

Now call a resource on the server:

	client.get('/some/resource/location', function(content) { 
		// do something with content here
	});

What makes Orphan different from most other XHR wrap-around libraries (or just using ``$.get`` in JQuery) is the suite of functions it contains to handle returned content.

For example:

### Render Markdown (example 1)

	function(content) { 
		var html = Orphan.markdown.makeHtml(content);
	}

### Render JSON (example 2)

	function(content) { 
	    var obj = JSON.parse(content);
	    var html = Orphan.utils.inspectToHTML(obj);
	}

### Render JSON with EJS template (example 3)

	function(content) { 
	    var obj = JSON.parse(content);
	    var template = Orphan.template.ejs.create(path_to_ejs_template);
	    var html = template.render(obj);
	}

### Render JSON with Mustache template (example 4)

	function(content) { 
        var obj = JSON.parse(content);
        var template = Orphan.template.mustache.create(path_to_mustache_template);
        var html = template.render(obj);
	}

### Render JSON with Dynamic template (example 5)

The dynamic template engine renders JSON as HTML but converts embedded links into clickable hrefs so that
they can be followed:

    // create client object

    var client = new Orphan("http://127.0.0.1/docs/");

    // parse query string and grab any resource request (res=path/to/json) from the url
    // if there is none then set a 'home' json resource

    var qs = Orphan.utils.queryStringObj(location.href);
    var resource = (qs['res']) ? qs['res'] : 'index.json';

    client.get(resource, function(json) { 
        var obj = JSON.parse(json);
        var template = Orphan.template.dynamic.create(cfg);
        document.body.innerHTML = template.render(obj);
    }

Any ``links: []`` sections containing ``href`` and ``rel`` fields will be rendered as clickable links of the form ``<a href="http://host/docs/?res=path/to/json"`` and will reload in the current page if clicked. Field names (``links``, ``href`` and ``rel`` are configurable for any of the various standard specs).

## Note

Because Orphan is a client-side script it is subject to cross-site-scripting (XSS) rules and so source sites must either be 'local' (same protocol, hostname and port as Orphan) or must use CORS. Orphan also supports JSONP.
