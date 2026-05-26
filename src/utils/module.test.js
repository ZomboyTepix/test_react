import { calculateAge, isAdult, isValidPostalCode, isValidName, isValidEmail } from './module.js';

describe('calculateAge', () => {
    it('should return a correct age for a known birth date', () => {
        const loise = { birth: new Date('11/07/1991') };
        expect(calculateAge(loise)).toEqual(34);
    });
    it('should throw "missing param p" when no argument given', () => {
        expect(() => calculateAge()).toThrow("missing param p");
    });
    it('should throw "missing birth date" when birth is an empty string', () => {
        expect(() => calculateAge({ birth: "" })).toThrow("missing birth date");
    });
    it('should throw "missing param p" when null is passed', () => {
        expect(() => calculateAge(null)).toThrow("missing param p");
    });
});

describe('isAdult', () => {
    it('should return true for a person born in 1990', () => {
        expect(isAdult({ birth: new Date('1990-06-15') })).toBe(true);
    });
    it('should return false for a person born 10 years ago', () => {
        const birth = new Date();
        birth.setFullYear(birth.getFullYear() - 10);
        expect(isAdult({ birth })).toBe(false);
    });
    it('should return false for a person born 17 years ago', () => {
        const birth = new Date();
        birth.setFullYear(birth.getFullYear() - 17);
        expect(isAdult({ birth })).toBe(false);
    });
    it('should return true for a person born exactly 18 years ago', () => {
        const birth = new Date();
        birth.setFullYear(birth.getFullYear() - 18);
        expect(isAdult({ birth })).toBe(true);
    });
    it('should throw "missing param p" when no argument given', () => {
        expect(() => isAdult()).toThrow("missing param p");
    });
    it('should throw "missing birth date" when birth property is absent', () => {
        expect(() => isAdult({})).toThrow("missing birth date");
    });
    it('should throw "missing birth date" for an invalid Date object', () => {
        expect(() => isAdult({ birth: new Date('invalid') })).toThrow("missing birth date");
    });
});



describe('isValidPostalCode', () => {
    it('should accept standard French postal codes', () => {
        expect(isValidPostalCode('75001')).toBe(true);
        expect(isValidPostalCode('06000')).toBe(true);
        expect(isValidPostalCode('13100')).toBe(true);
    });
    it('should reject a code with fewer than 5 digits', () => {
        expect(isValidPostalCode('7500')).toBe(false);
    });
    it('should reject a code with more than 5 digits', () => {
        expect(isValidPostalCode('750010')).toBe(false);
    });
    it('should reject a code containing letters', () => {
        expect(isValidPostalCode('7500A')).toBe(false);
    });
    it('should reject an empty string', () => {
        expect(isValidPostalCode('')).toBe(false);
    });
    it('should reject a non-string value', () => {
        expect(isValidPostalCode(75001)).toBe(false);
    });
    it('should reject a code with spaces', () => {
        expect(isValidPostalCode('750 0')).toBe(false);
    });
});


describe('isValidName', () => {
    it('should accept a simple name', () => {
        expect(isValidName('Dupont')).toBe(true);
    });
    it('should accept accented characters (é, è, ê, à, ü…)', () => {
        expect(isValidName('Éléonore')).toBe(true);
        expect(isValidName('Sébastien')).toBe(true);
        expect(isValidName('Noël')).toBe(true);
    });
    it('should accept hyphenated names', () => {
        expect(isValidName('Marie-Claire')).toBe(true);
        expect(isValidName('Jean-Baptiste')).toBe(true);
    });
    it('should accept names with an apostrophe', () => {
        expect(isValidName("D'Artagnan")).toBe(true);
    });
    it('should accept city names with spaces or hyphens', () => {
        expect(isValidName('Le Havre')).toBe(true);
        expect(isValidName('Aix-en-Provence')).toBe(true);
    });
    it('should accept ç and œ ligatures', () => {
        expect(isValidName('François')).toBe(true);
        expect(isValidName('Cœur')).toBe(true);
    });
    it('should reject a name containing digits', () => {
        expect(isValidName('Dupont1')).toBe(false);
    });
    it('should reject a name containing special characters (!@#…)', () => {
        expect(isValidName('Dupont!')).toBe(false);
        expect(isValidName('Jean@')).toBe(false);
    });
    it('should reject an empty string', () => {
        expect(isValidName('')).toBe(false);
    });
    it('should reject a string containing only spaces', () => {
        expect(isValidName('   ')).toBe(false);
    });
});



describe('isValidEmail', () => {
    it('should accept standard emails', () => {
        expect(isValidEmail('jean.dupont@gmail.com')).toBe(true);
        expect(isValidEmail('contact@example.fr')).toBe(true);
    });
    it('should accept emails with subdomains', () => {
        expect(isValidEmail('user@mail.example.com')).toBe(true);
    });
    it('should accept emails with + alias', () => {
        expect(isValidEmail('user+tag@gmail.com')).toBe(true);
    });
    it('should reject an email without @', () => {
        expect(isValidEmail('jeandupont.com')).toBe(false);
    });
    it('should reject an email without domain extension', () => {
        expect(isValidEmail('jean@dupont')).toBe(false);
    });
    it('should reject an email with spaces', () => {
        expect(isValidEmail('jean dupont@gmail.com')).toBe(false);
    });
    it('should reject an empty string', () => {
        expect(isValidEmail('')).toBe(false);
    });
    it('should reject a non-string value', () => {
        expect(isValidEmail(null)).toBe(false);
    });
});