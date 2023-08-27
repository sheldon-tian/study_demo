let nextUnitOfWork = null; // 工作单元
let currentRoot = null; // previous fiber tree root
let wipRoot = null;
let deletions = null; // 更新时需要删除旧 fiber array

const isEvent = key => key.startsWith('on');
const isProperty = key => key !== 'children' && !isEvent(key);
const isNew = (prev, next) => key => prev[key] !== next[key];
const isGone = (prev, next) => key => !(key in next);

const createElement = (type, props, ...children) => {
    return {
        type,
        props: {
            ...props,
            children: children.map(child => (
                typeof child === 'object'
                    ? child
                    : createTextElement(child)
            )),
        },
    };
};

const createTextElement = (text) => {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: [],
        },
    };
};

// 构建 fiber tree 时创建的 dom
const createDom = (fiber) => {
    const dom = fiber.type === 'TEXT_ELEMENT'
        ? document.createTextElement('')
        : document.createElement(fiber.type);

    Object.keys(fiber.props)
        .filter(key => isProperty(key))
        .forEach(key => {
            dom[key] = fiber.props[key];
        });

    return dom;
};

// (update dom)core
function updateDom(dom, prevProps, nextProps) {
    // remove old or changed event listener
    Object.keys(prevProps)
        .filter(isEvent)
        .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
        .forEach(name => {
            const eventType = name.toLowerCase().substring(2);
            dom.removeEventListener(
                eventType,
                prevProps[name],
            );
        });

    // add event listener
    Object.keys(nextProps)
        .filter(isEvent)
        .filter(isNew(prevProps, nextProps))
        .forEach(name => {
            const eventType = name.toLowerCase().substring(2);
            dom.addEventListener(
                eventType,
                nextProps[name],
            );
        });

    // remove old properties
    Object.keys(prevProps)
        .filter(isProperty)
        .filter(isGone(prevProps, nextProps))
        .forEach(name => {
            dom[name] = '';
        });

    // set new or changed properties
    Object.keys(nextProps)
        .filter(isProperty)
        .filter(isNew(prevProps, nextProps))
        .forEach(name => {
            dom[name] = nextProps[name];
        });
}

// 删除节点
function commitDeletion(fiber, domParent) {
    if (fiber.dom) {
        domParent.removeChild(fiber.dom);
    } else {
        commitDeletion(fiber.child, domParent);
    }
}

// (fiber tree => dom)core
function commitWork() {
    if (!fiber) {
        return;
    }

    let domParentFiber = fiber.parent;
    while (!domParentFiber.dom) {
        domParentFiber = domParentFiber.parent;
    }
    const domParent = domParentFiber.dom;

    if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
        domParent.appendChild(fiber.dom);
    } else if (effectTag === 'UPDATE' && fiber.dom != null) {
        updateDom(
            fiber.dom,
            fiber.alternate.props,
            fiber.props,
        );
    } else if (effectTag === 'DELETION') {
        commitDeletion(fiber.child, domParent);
    }

    domParent.appendChild(fiber.dom);
    commitWork(fiber.child);
    commitWork(fiber.sibling);
}

// 根据 fiber tree 创建 dom 链接(类组件) & 存储 old fiber tree 用于下一次 compare
function commitRoot() {
    // TODO add nodes to dom
    deletions.forEach(commitWork);
    commitWork(wipRoot.child);
    currentRoot = wipRoot;
    wipRoot = null;
}

// fiber compare
function reconcileChildren(wipFiber, elements) {
    let index = 0;
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
    let prevSibling = null;

    while (index < elements.length || oldFiber != null) {
        const element = elements[index];
        let newFiber = null;

        // TODO compare oldFiber to element(current node)
        const sameType = oldFiber && element && element.type === oldFiber.type;

        if (sameType) {
            // TODO just update node props
            newFiber = {
                type: oldFiber.type,
                props: element.props,
                dom: oldFiber.dom,
                parent: wipFiber,
                alternate: oldFiber,
                effectTag: 'UPDATE',
            };
        }

        if (element && !sameType) {
            // TODO add this node
            newFiber = {
                type: element.type,
                props: element.props,
                dom: null,
                parent: wipFiber,
                alternate: null,
                effectTag: 'PLACEMENT',
            };
        }

        if (oldFiber && !sameType) {
            // TODO delete the oldFiber's node
            oldFiber.effectTag = 'DELETION';
            deletions.push(oldFiber);
        }

        if (oldFiber) {
            oldFiber = oldFiber.sibling;
        }

        if (index === 0) {
            wipFiber.child = newFiber;
        } else {
            prevSibling.sibling = newFiber;
        }

        prevSibling = newFiber;
        index++;
    }
}

// 创建函数组件 fiber
function updateFunctionComponent(fiber) {
    const children = [fiber.type(fiber.props)];
    reconcileChildren(fiber, children);
}

// 创建类组件 fiber
function updateHostComponent(fiber) {
    if (!fiber.dom) {
        fiber.dom = createDom(fiber);
    }
    reconcileChildren(fiber, fiber.props.children);
}

// 构建 fiber tree
function performUnitOfWork(fiber) {
    // TODO add dom node
    if (!fiber.dom) {
        fiber.dom = createDom(fiber);
    }

    // TODO create new fiber
    const isFunctionComponent = fiber.type instanceof Function;
    if (isFunctionComponent) {
        updateFunctionComponent(fiber);
    } else {
        updateHostComponent(fiber);
    }
    const elements = fiber.props.children;
    reconcileChildren(fiber, elements);

    // TODO return next unit of work
    if (fiber.child) {
        return fiber.child;
    }
    let nextFiber = fiber;
    while (nextFiber) {
        if (fiber.sibling) {
            return nextFiber.sibling;
        }

        nextFiber = nextFiber.parent;
    }

    if (!nextUnitOfWork && wipRoot) {
        commitRoot();
    }
}

const workLoop = (deadLine) => {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(
            nextUnitOfWork
        );
        shouldYield = deadLine.timeRemaining() < 1;
    }

    requestIdleCallback(workLoop);
};

// 浏览空闲时执行工作单元
requestIdleCallback(workLoop);

const render = (element, container) => {
    // TODO set next unit of work
    wipRoot = {
        dom: container,
        props: {
            children: [element],
        },
        alternate: currentRoot,
    };
    deletions = [];
    nextUnitOfWork = wipRoot;
};

const Didact = {
    createElement,
    render,
};

// jsx => js
```javascript
function App(props) {
    return Didact.createElement(
        'h1',
        null,
        'Hi ',
        props.name,
    );
}
const element = Didact.createElement(App, {
    name: 'foo',
});
```

/** @jsx Didact.createElement */
function App(props) {
    return <h1>Hi {props.name}</h1>;
}
const element = <App name='foo' />
const container = document.getElementById('root');
Didact.render(element, container);

// 函数组件的不同之处
// - 函数组件的 fiber 没有 dom 节点
// - children 来自运行该函数，而不是直接从 props
