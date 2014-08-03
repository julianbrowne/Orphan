
describe('Orphan', function () { 

    beforeEach(function() { 
        jasmine.Ajax.install();
    });

    afterEach(function() { 
        jasmine.Ajax.uninstall();
    });

    it('should make a get request', function () { 
        var client = new Orphan('http://www.example.com');
        client.get('/index.html', function(data) { 
            console.log("done");
        });
        expect(jasmine.Ajax.requests.mostRecent().url).toBe('http://www.example.com/index.html');
    });

    it('should make a put request', function () { 
        var client = new Orphan('http://www.example.com');
        client.put('/index.html', {}, function(data) { 
            console.log("done");
        });
        expect(jasmine.Ajax.requests.mostRecent().url).toBe('http://www.example.com/index.html');
    });

    it('should make a post request', function () { 
        var client = new Orphan('http://www.example.com');
        client.post('/index.html', {}, function(data) { 
            console.log("done");
        });
        expect(jasmine.Ajax.requests.mostRecent().url).toBe('http://www.example.com/index.html');
    });

    it('should make a delete request', function () { 
        var client = new Orphan('http://www.example.com');
        client.delete('/index.html', function(data) { 
            console.log("done");
        });
        expect(jasmine.Ajax.requests.mostRecent().url).toBe('http://www.example.com/index.html');
    });

});