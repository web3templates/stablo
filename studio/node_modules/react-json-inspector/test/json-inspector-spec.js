var React = require('react');
var expect = require('chai').expect;

var enzyme = require('enzyme');
var shallow = enzyme.shallow;

var Inspector = require('..');
var Leaf = require('../lib/leaf');

var inspector = React.createFactory(Inspector);
var data = require('../example/data.json');

describe('<Inspector />', () => {
    beforeEach(function() {
        this.i = shallow(
            inspector({
                data: data
            })
        );
        this.root = this.i.find(Leaf).first().shallow();
    });

    it('has .json-inspector class name', function() {
        expect(this.i.hasClass('json-inspector')).to.equal(true);
    });

    it('has only one root node', function() {
        expect(this.i.find(Leaf)).to.have.length(1);
    });

    it('has the root expanded by default', function() {
        expect(this.root.state('expanded')).to.equal(true);
    });

    describe('root leaf', function() {
        it('has 46 child nodes', function() {
            expect(this.root.find(Leaf)).to.have.length(46);
        });

        it('has all his child nodes collapsed', function() {
            expect(this.root.find(Leaf).everyWhere(l => !l.shallow().state('expanded'))).to.equal(true);
        });

        it('has no nested root nodes', function() {
            expect(this.root.find(Leaf).everyWhere(l => !l.shallow().prop('root'))).to.equal(true);
        });
    });
});
