import omitKeys from './index';

omitKeys({ foo: 'bar', bar: 'baz' }, [ 'bar' ]); // returns `{foo: 'bar'}`
