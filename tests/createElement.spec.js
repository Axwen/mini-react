import React from '../core/React.js';

import { describe, it, expect } from 'vitest'


describe('createElement', () => {
    it('should create a div element', () => {
        const element = React.createElement('div', null, 'Hello, world!');
        expect(element).toMatchSnapshot(`
            {
              "props": {
                "children": [
                    {
                        "props":{
                            "children":[],
                            "nodeValue": "Hello, world!",
                        },
                        "type": "TEXT_ELEMENT",
                    }
                ],
              },
              "type": "div",
            }
        `)
    })
})