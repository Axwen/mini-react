
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

function createDom(type) {
    return type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type)
}


function render(el, container) {
    nextWorkOfUnit = wipRoot = {
        dom: container,
        props: {
            children: [el]
        }
    }
}
function update() {
    const currentFiber = wipFiber
    return () => {
        console.log('currentFiber', currentFiber)
        wipRoot = {
            ...currentFiber,
            alternate: currentFiber
        }
        nextWorkOfUnit = wipRoot
    }
}

// work in progress
let wipRoot = null
let nextWorkOfUnit = null
let deletions = []
let wipFiber = null
function workLoop(deadline) {
    let shouldYield = false
    while (!shouldYield && nextWorkOfUnit) {
        nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)
        if(wipRoot?.sibling?.type === nextWorkOfUnit?.type){
            console.log('hit',wipRoot,nextWorkOfUnit)
            nextWorkOfUnit = undefined
        }
        shouldYield = deadline.timeRemaining() < 1
    }


    if (!nextWorkOfUnit && wipRoot) {
        commitRoot()
    }

    requestIdleCallback(workLoop)
}
function commitRoot() {
    deletions.forEach(commitDeletion)
    commitWork(wipRoot.child)
    wipRoot = null
    deletions = []
}
function commitWork(fiber) {
    if (!fiber) {
        return
    }

    let fiberReturn = fiber.return
    while (!fiberReturn.dom) {
        fiberReturn = fiberReturn.return
    }
    const { effectTag } = fiber
    if (effectTag === 'PLACEMENT') {
        if (fiber.dom) {
            fiberReturn.dom.append(fiber.dom)
        }
    } else if (effectTag === 'UPDATE') {
        updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
    }

    commitWork(fiber.child)
    commitWork(fiber.sibling)
}

function commitDeletion(fiber) {
    if (fiber.dom) {
        let fiberReturn = fiber.return
        while (!fiberReturn.dom) {
            fiberReturn = fiberReturn.return
        }
        fiberReturn.dom.removeChild(fiber.dom)
    } else {
        commitDeletion(fiber.child)
    }

}

function updateProps(dom, props = {}, oldProps = {}) {
    //删除
    Object.keys(oldProps).forEach(key => {
        if (key !== 'children') {
            if (!(key in props)) {
                dom.removeAttribute(key)
            }
        }
    })
    // 添加,更新
    Object.keys(props).forEach(key => {
        if (key !== 'children') {
            if (props[key] !== oldProps[key]) {
                if (key.startsWith('on')) {
                    const event = key.slice(2).toLocaleLowerCase()
                    dom.removeEventListener(event, oldProps[key])
                    dom.addEventListener(event, props[key])
                } else {
                    dom[key] = props[key]
                }
            }

        }
    })
}
function updateFunctionComponent(fiber) {
    wipFiber = fiber
    const { type, props } = fiber
    const children = [type(props)]
    reconcileChildren(fiber, children)
}

function updateHostComponent(fiber) {
    const { type, props, dom } = fiber
    if (!dom) {
        const dom = (fiber.dom) = createDom(type)

        updateProps(dom, props)
    }
    const children = props?.children
    reconcileChildren(fiber, children)
}

function reconcileChildren(fiber, children = []) {
    let oldFiber = fiber.alternate?.child
    let prevChild = null
    children.forEach((child, index) => {
        const isSameType = oldFiber && child && oldFiber.type === child.type
        let newfilber = null;
        if (isSameType) {
            newfilber = {
                type: child.type,
                props: child.props,
                child: null,
                return: fiber,
                sibling: null,
                dom: oldFiber.dom,
                alternate: oldFiber,
                effectTag: 'UPDATE'
            }
        } else {
            if (child) {
                newfilber = {
                    type: child.type,
                    props: child.props,
                    child: null,
                    return: fiber,
                    sibling: null,
                    dom: null,
                    effectTag: 'PLACEMENT'
                }
            }
            if (oldFiber) {
                deletions.push(oldFiber)
            }
        }

        // 更新旧的fiber
        if (oldFiber) {
            oldFiber = oldFiber.sibling
        }
        if (index === 0) {
            fiber.child = newfilber
        } else {
            prevChild.sibling = newfilber
        }
        if (newfilber) {
            prevChild = newfilber
        }
    })
    while (oldFiber) {
        deletions.push(oldFiber)
        oldFiber = oldFiber.sibling
    }
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
    update,
    createElement,
    render
}

export default React;