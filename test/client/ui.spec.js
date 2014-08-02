
describe('UI', function () { 

    beforeEach(function() { 
        results = document.createElement('div');
        results.id = 'test-results';
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(results);
    });

    afterEach(function() { 
        var results = document.getElementById('test-results');
        results.parentNode.removeChild(results);
    });

    it('should add a div', function () { 
        Orphan.ui.addDiv('bob','test-results');
        var r1 = document.getElementById('test-results').childNodes[0];
        expect(r1).not.toBeNull();
        expect(r1.innerHTML).toEqual('bob');
    });

    it('should get an element', function () { 
        var r1 = Orphan.ui.getElement('test-results');
        console.log(r1);
        expect(r1).not.toBeNull();
        if(r1.outerHTML)
            expect(r1.outerHTML).toEqual('<div id="test-results"></div>');
    });

    it('should make elements', function () { 
        var r1 = Orphan.ui.makeElement('a');
        var r2 = Orphan.ui.makeElement('p');
        expect(r1).not.toBeNull();
        if(r1.outerHTML)
            expect(r1.outerHTML).toEqual('<a></a>');
        expect(r2).not.toBeNull();
        if(r2.outerHTML)
            expect(r2.outerHTML).toEqual('<p></p>');
    });

    it('should make a link', function () { 
        var r1 = Orphan.ui.makeLink('http://www.example.com','example');
        expect(r1).not.toBeNull();
        if(r1.outerHTML)
            expect(r1.outerHTML).toEqual('<a href="http://www.example.com">example</a>');
    });

});