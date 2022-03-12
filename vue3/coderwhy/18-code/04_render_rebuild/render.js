/*
 * @Author: your name
 * @Date: 2021-11-14 10:14:16
 * @LastEditTime: 2021-11-14 11:31:20
 * @LastEditors: Please set LastEditors
 * @Description: 渲染器代码
 * @FilePath: \vue3\18-code\04_render_rebuild\render.js
 */
/** 1. h 函数：创建一个 vnode */
const vnode = h("div", { class: "why" }, [
  h("h2", null, "当前计数：100"),
  h("button", null, "+1"),
]);

const h = (tag, props, children) => {
  return {
    tag,
    props,
    children,
  };
};

/** 2. 挂载：通过 mount 函数 将 vnode 挂载到 container 上 */
mount(vnode, container); // container: document.querySelector('#app')

const mount = (vnode, container) => {
  // 1. 创建真实原生 dom 元素，并且在 vnode 上保留 el
  const el = (vnode.el = document.createElement(vnode.tag));

  // 2. 处理 props
  if (vnode.props) {
    for (const key in vnode.props) {
      if (Object.hasOwnProperty.call(vnode.props, key)) {
        const value = vnode.props[key];

        // 对点击事件做兼容
        if (key.startsWith("on")) {
          el.addEventListener(key.slice2(2).toLowerCase(), value);
        } else {
          el.setAttribute(key, value);
        }
      }
    }
  }

  //  3. 处理 children：不考虑对象，只考虑 字符串 + 数组
  if (vnode.children) {
    if (typeof vnode.children === "string") {
      el.textContent = vnode.children;
    } else {
      vnode.children.forEach((item) => {
        mount(item, el);
      });
    }
  }

  // 4. 挂载到 container 上
  container.appendChild(el);
};

/** 3. 创建新的 VNode */
const vnode1 = h("div", { class: "coderwhy" }, "哈哈哈");

patch(vnode, vnode1);

const patch = (n1, n2) => {
  if (n1.tag !== n2.tag) {
    // 不管三七二十一，直接移除整个 DOM 树
    const n1ElParent = n1.el.parentElement;
    n1ElParent.removeChild(n1.el);
    mount(n2, n1ElParent);
  } else {
    // 对 n1 进行细致的修改
    const el = (n2.el = n1.el);

    // 1. 处理 props
    const oldProps = n1.props || {};
    const newProps = n2.props || {};
    // 1.1  获取所有的 newProps 添加到 el
    for (const key in newProps) {
      const oldValue = oldProps[key];
      const newValue = newProps[key];
      if (newValue !== oldValue) {
        // 对事件做兼容
        if (key.startsWith("on")) {
          el.addEventListener(key.slice2(2).toLowerCase(), newValue);
        } else {
          el.setAttribute(key, newValue);
        }
      }
    }
    // 1.2 删除旧的 props
    for (const key in oldProps) {
      if (!(key in newProps)) {
        if (key.startsWith("on")) {
          const value = oldProps[key];
          el.removeEventListener(key.slice(2).toLowerCase(), value); // 事件移除
        } else {
          el.removeAttribute(key);
        }
      }
    }

    // 2. 处理 childrend
    const oldChildrend = n1.children || [];
    const newChildren = n2.children || [];
    if (typeof newChildren === "string") {
      // 情况一：字符串
      el.innerHTML = newChildren;
    } else {
      // 情况二：数组，不管别的了
      if (typeof oldChildren === "string") {
        el.innerHTML = "";
        newChildren.forEach((item) => {
          mount(item, el);
        });
      } else {
        // 好家伙，都是数组，救命
        const commonLength = Math.min(oldChildrend.length, newChildren.length);
        // 1. 前面有相同节点的原生进行 patch
        for (let i = 0; i < commonLength; i++) {
          patch(oldChildrend[i], newChildren[i]);
        }
        // 2. 新的 children 更长
        if (newChildren.length > oldChildren.length) {
          newChildren.slice(oldChildrend.length).forEach((item) => {
            mount(item, el);
          });
        }
        // 3. 旧的 children 更长
        if (newChildren.length < oldChildren.length) {
          oldChildren.slice(newChildrend.length).forEach((item) => {
            el.removeChild(item.el);
          });
        }
      }
    }
  }
};
