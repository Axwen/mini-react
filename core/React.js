
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
    nextWorkOfUnit = {
        dom: container,
        props: {
            children: [el]
        }
    }
}

let nextWorkOfUnit = null
function workLoop(deadline) {
    let shouldYield = false
    while (!shouldYield && nextWorkOfUnit) {
        nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)
        shouldYield = deadline.timeRemaining() < 1
    }
    requestIdleCallback(workLoop)
}

function createDom(type) {
    return type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type)
}

function updateProps(dom, props) {
    Object.keys(props).forEach(key => {
        if (key !== 'children') {
            dom[key] = props[key]
        }
    })
}

function initChildren(fiber) {
    const children = fiber.props.children
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
    const { type, props, dom } = fiber
    if (!dom) {
        const dom = (fiber.dom) = createDom(type)
        fiber.return.dom.append(dom)
        updateProps(dom, props)
    }

    initChildren(fiber)
    // 4. 返回下一个要执行的任务
    if (fiber.child) {
        return fiber.child
    }
    if (fiber.sibling) {
        return fiber.sibling
    }

    return fiber.return?.sibling
}
requestIdleCallback(workLoop)

const React = {
    createElement,
    render
}

export default React;