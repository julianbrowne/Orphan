
define(function() { 

    return { 

        addDiv: function(content, targetId) { 
            var element = this.makeElement('div', content);
            var target  = this.getElement(targetId);
            target.appendChild(element);
        },

        getElement: function(elementId) {
            var target = document.getElementById(elementId);
            if(target===null) target=document.getElementsByTagName('body')[0];
            return target;
        },

        makeElement: function(type, content) { 
            var element = document.createElement(type);
            var content = (content === undefined) ? '' : content;
            element.innerHTML = content;
            return element;
        }

    }
    
});