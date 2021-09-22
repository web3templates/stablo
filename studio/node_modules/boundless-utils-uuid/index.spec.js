import uuid from './index';

describe('html-suitable uuid generator utility', () => {
    it('prefixes the UUIDs with "b-"', () => {
        expect(uuid()).toContain('b-');
    });

    it('creates consistently unique identifiers', () => {
        const ids = [];

        for (let i = 0; i < 10000; i += 1) {
            let id = uuid();

            expect(ids.indexOf(id) === -1).toBe(true);

            ids.push(id);
        }

    });
});
