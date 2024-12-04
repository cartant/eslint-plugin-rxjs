import decamelize from 'decamelize';
import { createRegExpForWords } from '../src/utils';

describe('utils', () => {
  describe('createRegExpForWords', () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const regExp = createRegExpForWords(['add'])!;

    it('should match action literals', () => {
      expect(`"ADD"`).toMatch(regExp);
      expect(`"ADD_SOMETHING"`).toMatch(regExp);
      expect(`"SOMETHING_ADD"`).toMatch(regExp);

      expect(`'ADD'`).toMatch(regExp);
      expect(`'ADD_SOMETHING'`).toMatch(regExp);
      expect(`'SOMETHING_ADD'`).toMatch(regExp);

      expect('`ADD`').toMatch(regExp);
      expect('`ADD_SOMETHING`').toMatch(regExp);
      expect('`SOMETHING_ADD`').toMatch(regExp);
    });

    it('should match action symbols', () => {
      expect('ADD').toMatch(regExp);
      expect('ADD_SOMETHING').toMatch(regExp);
      expect('SOMETHING_ADD').toMatch(regExp);

      expect(decamelize('Add')).toMatch(regExp);
      expect(decamelize('AddSomething')).toMatch(regExp);
      expect(decamelize('SomethingAdd')).toMatch(regExp);
    });

    it('should not match words within larger words', () => {
      expect('READD').not.toMatch(regExp);
      expect('Readd').not.toMatch(regExp);

      expect('ADDER').not.toMatch(regExp);
      expect('Adder').not.toMatch(regExp);

      expect('LADDER').not.toMatch(regExp);
      expect('Ladder').not.toMatch(regExp);
    });

    it('should create a RegExp from a string', () => {
      expect(createRegExpForWords('.')?.toString()).toEqual('/./i');
    });
  });
});
