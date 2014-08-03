
describe('Utils', function () { 

    beforeEach(function() { 
        utils = Orphan.utils;
    });

    it('should convert string to CamelCase', function () { 
        var result = utils.toCamelCase("my-camel-case-string");
        expect(result).toEqual("myCamelCaseString");
    });

    it('should convert string to dashed', function () { 
        var result = utils.toDashed("myCamelCaseString");
        expect(result).toEqual("my-camel-case-string");
    });

    it('should titleize a string', function () { 
        var result = utils.titleize("a mix of words");
        expect(result).not.toEqual("a mix words");
        expect(result).toEqual("A Mix Of Words");
    });

    it('should humanize a string', function () { 
        var result = utils.humanize("MixOfWords");
        expect(result).not.toEqual("MixOfWords");
        expect(result).toEqual("mix of words");
        var result2 = utils.humanize("mix--of-words");
        expect(result2).toEqual("mix of words");
    });

    it('should capitalise a string', function () { 
        var result = utils.capitalize("my sentence");
        expect(result).not.toEqual("my sentence");
        expect(result).toEqual("My sentence");
    });

    it('should underscore a string', function () { 
        var result = utils.underscored("my sentence");
        expect(result).not.toEqual("my sentence");
        expect(result).toEqual("my_sentence");
    });

    it('should supplant a string template', function () { 
        var templ = "<div><p>{name}</p><p>{age}</p><p>{name}</p></div>";
        var obj = {name: 'bob', age: 42 };
        var result = utils.supplant(templ,obj);
        expect(result).toEqual("<div><p>bob</p><p>42</p><p>bob</p></div>");
    });

    it('should create form field', function () { 
        var r1 = utils.jsToFormField('bob', 'bob', 'bobId', 50);
        expect(r1).toEqual('<input type="text" jsontype="string" name="bob" id="bobId" size="50" value="bob" />');
        var r2 = utils.jsToFormField(99, 'alice', 'aliceId', 10);
        expect(r2).toEqual('<input type="text" jsontype="number" name="alice" id="aliceId" size="10" value="99" />');
        var r3 = utils.jsToFormField(true, 'aa', 'aaId');
        expect(r3).toEqual('<input type="checkbox" jsontype="boolean" name="aa" id="aaId" checked />');
        var r4 = utils.jsToFormField(false, 'bb', 'bbId');
        expect(r4).toEqual('<input type="checkbox" jsontype="boolean" name="bb" id="bbId"  />');
    });

    it('should parse a url parameter', function () { 
        var r1 = utils.getURLParameter("bob", "http://www.example.com/something?bob=10");
        expect(r1).toEqual("10");
        var r2 = utils.getURLParameter("bob", "http://www.example.com/something?alice=10");
        expect(r2).toEqual(null);
    });

    it('should workout types properly', function () { 
        expect(utils.getType("bob")).toEqual("string");
        expect(utils.getType({bob:10})).toEqual("object");
        expect(utils.getType(["bob"])).toEqual("array");
        expect(utils.getType(function(){})).toEqual("function");
        expect(utils.getType(10)).toEqual("number");
    });

    it('should determine valid json', function () { 
        expect(utils.isValidJSON('{ "a": 10 }')).toBe(true);
        expect(utils.isValidJSON('{ "a: 10 }')).toBe(false);
    });

    it('should determine valid integers', function () { 
        expect(utils.isInteger(10)).toBe(true);
        expect(utils.isInteger("a")).toBe(false);
        expect(utils.isInteger(10.5)).toBe(false);
    });

    it('should make guids', function () { 
        var r1 = utils.guid();
        var r2 = utils.guid();
        var r3 = utils.guid("bob");
        expect(r1).not.toEqual(r2);
        expect(r3.substring(0,3)).toEqual("bob");
    });

    it('should determine fake browser interface', function () { 
        expect(utils.isHTTPServer()).toBe(true);
    });

    it('should inspect an object correctly', function () { 
        var obj = { a: 1, b: { c: 2 }};
        var r1 = utils.inspectToHTML(obj);
        expect(r1).toEqual("<ul><li>[number] a : 1</li><li>[object] b : [object Object]</li><ul><li>[number] c : 2</li></ul></ul>");
        var r2 = utils.inspectToString(obj);
        expect(r2).toEqual("[number] a : 1[object] b : [object Object][number] c : 2");
    });

});
