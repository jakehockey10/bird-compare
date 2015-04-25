








var assert = require('assert');
var should = require('should');

describe('Results', function () {
    var results = new Results([]);
    results.should.have.property('array').and.be.an.Array;
    results.array.length.should.equal(0);
});

describe('Comparison', function () {
    var comparison = new Comparison([], []);
    comparison.should.have.property('total', 0);
    describe('with two results', function () {
        var left = new Results(leftResults);
        var right = new Results(rightResults);
        var comparison = new Comparison([{thing: '1'}], [{thing: '2'}]);
        comparison.should.have.property('total', 2);
        comparison.should.have.property('leftTotal', 1);
        comparison.should.have.property('rightTotal', 1);
    })
});
