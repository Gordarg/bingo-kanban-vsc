const assert = require('assert');
const vscode = require('vscode');
const myExtension = require('../extension');

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Test registerBoardCommand function', () => {
        assert.strictEqual(typeof myExtension.registerBoardCommand, 'function');
    });
});
