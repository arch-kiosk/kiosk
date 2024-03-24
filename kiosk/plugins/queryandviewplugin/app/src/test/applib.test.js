import { deleteHtmlAndSpecialCharacters } from '../lib/applib';
import { expect, test } from "vitest";

test('KioskApp deleteHtmlAndSpecialCharacters should remove HTML tags from the text', () => {
    const result = deleteHtmlAndSpecialCharacters('<p>Hello World</p>');
    expect(result).toBe('HelloWorld');
});

test('KioskApp deleteHtmlAndSpecialCharacters should remove special characters from the text', () => {
    const result = deleteHtmlAndSpecialCharacters('Hello@World#2021');
    expect(result).toBe('HelloWorld2021');
});

test('KioskApp deleteHtmlAndSpecialCharacters should return an empty string if the input is an empty string', () => {
    const result = deleteHtmlAndSpecialCharacters('');
    expect(result).toBe('');
});

test('KioskApp deleteHtmlAndSpecialCharacters should return the same string if there are no HTML tags or special characters', () => {
    const result = deleteHtmlAndSpecialCharacters('HelloWorld');
    expect(result).toBe('HelloWorld');
});

test('KioskApp deleteHtmlAndSpecialCharacters should handle null input gracefully', () => {
    const result = deleteHtmlAndSpecialCharacters(null);
    expect(result).toBe('');
});

test('KioskApp deleteHtmlAndSpecialCharacters should remove special characters and tags from a real error', () => {
    const result = deleteHtmlAndSpecialCharacters('This is a real <br> error that can occur                      ');
    expect(result).toBe('Thisisarealerrorthatcanoccur');
});
