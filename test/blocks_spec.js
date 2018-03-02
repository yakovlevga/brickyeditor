// const
//     mocha = require('mocha'),
//     chai = require('chai'),
//     rewire = require('rewire');
import {expect} from 'chai';
import rewire from 'rewire';
import jquery from 'jquery';
import { JSDOM } from 'jsdom';
const { window } = new JSDOM();
const jQuery = jquery(window);
global.window = window;
global.jQuery = jQuery;
global.$ = jQuery;

describe('Block tests', () => {
    describe('a number', () => {
        const bre2 =req
        const bre = rewire('../dist/brickyeditor.js').__get__('BrickyEditor');

        bre.Fields.BaseField.registerCommonFields();        

        const templateEl = $(
            '<div class="bre-template" data-name="Display Heading 1">' +
                '<h2 class="display-2" data-bre-field=\'{ "name" : "text", "type": "html" }\'></h1>' +
            '</div>')[0];
        
        const template = new bre.Template(templateEl);
        const block = new bre.Block(template, false, [{ name: 'text', html: 'Test'}]);

        it('Fields binding', () => {
            expect(block.fields.length).to.equal(1);
        });

        it('Rendering', () => {
            const $el = $(block.getHtml());
            expect($el.is('h2')).to.equal(true);
            expect($el.text()).to.equal('Test');
        })
    });
});