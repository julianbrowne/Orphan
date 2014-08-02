/*
url_template.js -- URL templating (version 0.7)

Copyright (c) 2005 Mark Nottingham <mnot@pobox.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

 ----------------------------------------------------------------------------------
 
 See http://www.mnot.net/javascript/url_template/ for documentation.
 
 TODO:
 - allow more than one var per cookie (url-encoding? JSON?)
 - encodings:
   - RDF
   - XML
   - url encoding
 - check navigator property to see if browser will handle this without javascript

 ----------------------------------------------------------------------------------
 */

var url_template = {
    store: {},

    init: function () {
        var cookies = document.cookie.split(';');
        for (var c=0; c < cookies.length; c++) {
            var cookie = cookies[c];
            while (cookie.charAt(0)==' ') cookie = cookie.substring(1,cookie.length);
            var c_eq = cookie.indexOf("=");
            var c_name = cookie.substring(0, c_eq);
            var c_value = cookie.substring(c_eq + 1, cookie.length);
            this.store["cookie:" + c_name] = unescape(c_value);
        };
        var store_links = this.get_links("template_store", false);
        for (var s=0; s < store_links.length; s++) {
            var store_link = store_links[s];
            if (store_link.href && store_link.title) {
                var store_href = this.expand_uri(store_link.href);
                if (! store_href) return;
                var req = false;
                if (window.XMLHttpRequest) {
                    try {
                        req = new XMLHttpRequest();
                    } catch(e) {
                        req = false;
                    }
                } else if (window.ActiveXObject) {
                    try {
                        req = new ActiveXObject("Microsoft.XMLHTTP");
                    } catch(e) {
                        req = false;
                    }
                }
                if (req) {
                    try {
                        req.open("GET", store_href, false); // can this be async? probably, but needs work
                        if (store_link.type) {
                            req.setRequestHeader("Accept", store_link.type + ";q=1, */*;q=0.5");
                        }
                        req.send("");
                        if (! this.store.json) this.store.json = new Object(); // just json for now
                        this.store.json[store_link.title] = eval("(" + req.responseText + ")"); // we trust this because it's the same server
                    } catch(e) {
                        alert("problem loading store\n " + store_href + ": \n" + e + ' \n\n' + req.status + " " + req.statusText + "\n" + req.responseText);
                    };
                };
            };
        };
    },

    do_templates: function (targets, attr_name) {
        for (var t=0; t < targets.length; t++) {
            var target = targets[t];
            var elements = document.getElementsByTagName(target);
            for (var e=0; e < elements.length; e++) {
                var element = elements[e];
                var uri_template = element.getAttribute(attr_name + "_template");
                if (uri_template) {
                    var uri = this.expand_uri(uri_template);
                    if (uri) element.setAttribute(attr_name, uri);
                }
            }
        }
    },

    expand_uri: function (uri) {
        var vars = uri.match(/{[^}]+}/g);
        if (! vars) return uri;
        for (var v=0; v < vars.length; v++) {
            var name = /{([^}]+)}/.exec(vars[v])[1];
            var var_type = name.substring(0, name.indexOf(":")) || name
            var value;
            switch (var_type) {
            case "json":
                var json_expr = name.substring(name.indexOf(":") + 1);
                try {
                    value = eval("this.store.json." + json_expr);
                } catch(e) {
                    value = "";
                }
                break
            default:
                value = this.store[name];
            }
            var search = new RegExp("{" + name + "}");            
            if (value) {
                uri = uri.replace(search, value);
            } else {
                uri = this.template_fallback(uri, name);
                if (! uri) return;
            }
        }
        return uri;
    },

    template_fallback: function (uri, name) {
        var links = document.getElementsByTagName("link");
        var redirect_uri = this.get_links("template_redirect", false)[0];
        if (redirect_uri.href) {
            document.location = redirect_uri.href;
            return; // should never happen;
        }
        var default_string = this.get_meta("template_default", false);    
        if (default_string) {
            var search = new RegExp("\\{" + name + "\\}");
            uri = uri.replace(search, default_string);
            return uri;
        }
        return;
    },

    get_meta: function (name, value_default) {
        var metas = document.getElementsByTagName("meta");
        for (var m=0; m < metas.length; m++) {
            var meta_name = metas[m].getAttribute("name");
            if (meta_name == name) {
                return metas[m].getAttribute("content");
            }
        }
        return value_default;
    },

    get_links: function (rel, title_default) {
        var links = document.getElementsByTagName("link");
        var out = new Array();
        for (var l=0; l < links.length; l++) {
            var link = links[l];
            var link_rel = link.getAttribute("rel");
            if (link_rel == rel) {
                var tmp = new Object();
                tmp.href = link.getAttribute("href");
                tmp.type = link.getAttribute("type") || false;
                tmp.title = link.getAttribute("title") || title_default;
                out.push(tmp);
            }        
        }
        return out;
    },

    /*
     * (c)2006 Dean Edwards/Matthias Miller/John Resig
     * Special thanks to Dan Webb's domready.js Prototype extension
     * and Simon Willison's addLoadEvent
     *
     * For more info, see:
     * http://dean.edwards.name/weblog/2006/06/again/
     * http://www.vivabit.com/bollocks/2006/06/21/a-dom-ready-extension-for-prototype
     * http://simon.incutio.com/archive/2004/05/26/addLoadEvent
     * 
     * Thrown together by Jesse Skinner (http://www.thefutureoftheweb.com/)
     *
     *
     * To use: call addDOMLoadEvent one or more times with functions, ie:
     *
     *    function something() {
     *       // do something
     *    }
     *    addDOMLoadEvent(something);
     *
     *    addDOMLoadEvent(function() {
     *        // do other stuff
     *    });
     *
     */ 
    addDOMLoadEvent: function(func) {
       if (!window.__load_events) {
          var init = function () {
              // quit if this function has already been called
              if (arguments.callee.done) return;
          
              // flag this function so we don't do the same thing twice
              arguments.callee.done = true;
          
              // kill the timer
              if (window.__load_timer) {
                  clearInterval(window.__load_timer);
                  window.__load_timer = null;
              }
              
              // execute each function in the stack in the order they were added
              for (var i=0;i < window.__load_events.length;i++) {
                  window.__load_events[i]();
              }
              window.__load_events = null;
              
              // clean up the __ie_onload event
              /*@cc_on @*/
              /*@if (@_win32)
                  document.getElementById("__ie_onload").onreadystatechange = "";
              /*@end @*/
          };
       
          // for Mozilla/Opera9
          if (document.addEventListener) {
              document.addEventListener("DOMContentLoaded", init, false);
          }
          
          // for Internet Explorer
          /*@cc_on @*/
          /*@if (@_win32)
              document.write("<scr"+"ipt id=__ie_onload defer src=javascript:void(0)><\/scr"+"ipt>");
              var script = document.getElementById("__ie_onload");
              script.onreadystatechange = function() {
                  if (this.readyState == "complete") {
                      init(); // call the onload handler
                  }
              };
          /*@end @*/
          
          // for Safari
          if (/WebKit/i.test(navigator.userAgent)) { // sniff
              window.__load_timer = setInterval(function() {
                  if (/loaded|complete/.test(document.readyState)) {
                      init(); // call the onload handler
                  }
              }, 10);
          }
          
          // for other browsers
          window.onload = init;
          
          // create event function stack
          window.__load_events = [];
       }
       
       // add function to event stack
       window.__load_events.push(func);
    }
};

url_template.init();
url_template.addDOMLoadEvent(function(){url_template.do_templates(['hx:include', 'include'], 'src')});
url_template.addDOMLoadEvent(function(){url_template.do_templates(['a', 'link'], 'href')});
url_template.addDOMLoadEvent(function(){url_template.do_templates(['form'], 'action')});
