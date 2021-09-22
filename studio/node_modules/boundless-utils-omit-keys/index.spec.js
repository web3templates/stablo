import omit from './index';

describe('omit(sourceObject: object, keysToExclude: array) utility', () => {
    it('excludes no keys if the second arg is not provided', () => {
        expect(omit({ foo: 'bar' })).toEqual({ foo: 'bar' });
    });

    it('excludes only keys provided by the second arg', () => {
        expect(omit({ foo: 'bar', bar: 'baz', baz: 'fizz' }, [ 'bar' ])).toEqual({ foo: 'bar', baz: 'fizz' });
    });
});
