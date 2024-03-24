import { KioskApp } from '../../kioskapplib/kioskapp';
import { expect,test } from 'vitest';

test('KioskApp splitAppError should return an object with id and message when error string contains a colon', () => {
    const kioskApp = new KioskApp();
    const result = kioskApp.splitAppError('1234:This is an error message');
    expect(result).toEqual({id: '1234', message: 'This is an error message'});
});

test('KioskApp splitAppError should return an object with empty id and the error as message when error string does not contain a colon', () => {
    const kioskApp = new KioskApp();
    const result = kioskApp.splitAppError('This is an error message');
    expect(result).toEqual({id: '', message: 'This is an error message'});
});

test('KioskApp splitAppError should return an object with empty id and message when error string is empty', () => {
    const kioskApp = new KioskApp();
    const result = kioskApp.splitAppError('');
    expect(result).toEqual({id: '', message: ''});
});

test('KioskApp splitAppError should return an object with id and message when error string contains many colons', () => {
    const kioskApp = new KioskApp();
    const result = kioskApp.splitAppError('987asdflkjaöfd:This is an error message: and it has a colon: :');
    expect(result).toEqual({id: '987asdflkjaöfd', message: 'This is an error message: and it has a colon: :'});
});

test('KioskApp splitAppError should return an only the error message if this starts with a colon', () => {
    const kioskApp = new KioskApp();
    const result = kioskApp.splitAppError(':This is an error message: and it has a colon: :');
    expect(result).toEqual({id: '', message: 'This is an error message: and it has a colon: :'});
});
