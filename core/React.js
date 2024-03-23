
function createTextNode(text) {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: [],
        }
    }
}


function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(child => {
                return typeof child === 'string' ? createTextNode(child) : child
            })
        }
    }
}

function render(el, container) {
    const { type, props: { children = [], ...props }, } = el
    const dom = type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(el.type)

    Object.keys(props).forEach(key => {
        dom[key] = props[key]
    })

    children.forEach(child => {
        render(child, dom)
    })
    container.appendChild(dom)
}


const React = {
    createElement,
    render
}

export default React;