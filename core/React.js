
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
                const isTextNode = ['string', 'number'].includes(typeof child)
                return isTextNode ? createTextNode(child) : child
            })
        }
    }
}

function render(el, container) {
    nextWorkOfUnit = root = {
        dom: container,
        props: {
            children: [el]
        }
    }
}
let root = null
let nextWorkOfUnit = null
function workLoop(deadline) {
    let shouldYield = false
    while (!shouldYield && nextWorkOfUnit) {
        nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)
        shouldYield = deadline.timeRemaining() < 1
    }


    if (!nextWorkOfUnit && root) {
        commitRoot()
    }

    requestIdleCallback(workLoop)
}
function commitRoot() {
    commitWork(root.child)
    root = null
}
function commitWork(fiber) {
    if (!fiber) {
        return
    }

    let fiberReturn = fiber.return
    while (!fiberReturn.dom) {
        fiberReturn = fiberReturn.return
    }
    if (fiber.dom) {
        fiberReturn.dom.append(fiber.dom)
    }
    commitWork(fiber.child)
    commitWork(fiber.sibling)
}

function createDom(type) {
    return type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type)
}

function updateProps(dom, props = {}) {
    Object.keys(props).forEach(key => {
        if (key !== 'children') {
            dom[key] = props[key]
        }
    })
}
function updateFunctionComponent(fiber) {
    const { type, props } = fiber
    const children = [type(props)]
    initChildren(fiber, children)
}

function updateHostComponent(fiber) {
    const { type, props, dom } = fiber
    if (!dom) {
        const dom = (fiber.dom) = createDom(type)

        updateProps(dom, props)
    }
    const children = props?.children
    initChildren(fiber, children)
}

function initChildren(fiber, children = []) {
    let prevChild = null
    children.forEach((child, index) => {
        const newfilber = {
            type: child.type,
            props: child.props,
            child: null,
            return: fiber,
            sibling: null,
            dom: null
        }
        if (index === 0) {
            fiber.child = newfilber
        } else {
            prevChild.sibling = newfilber
        }
        prevChild = newfilber
    })
}



function performWorkOfUnit(fiber) {
    const { type } = fiber
    const isFunctionComponent = typeof type === 'function'

    if (isFunctionComponent) {
        updateFunctionComponent(fiber)
    } else {
        updateHostComponent(fiber)
    }

    if (fiber.child) {
        return fiber.child
    }

    let nextFiber = fiber
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling
        }
        nextFiber = nextFiber.return
    }
}
requestIdleCallback(workLoop)

const React = {
    createElement,
    render
}

export default React;