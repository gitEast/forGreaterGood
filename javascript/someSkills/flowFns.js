/**
 * @description: 自动化处理函数
 * @param {array} fns 需要处理的函数
 */
function flowFns(...fns) {
  /**
   * @description: 生成器函数
   * @param {Array} fns 需要组合的函数
   */
  function* composeFns(fns) {
    // 1. 防止返回值不是 Promise 对象的函数导致 yield 的错误
    const newFns = fns.map(fn => {
      return res => {
        return new Promise(async resolve => {
          const result = await fn(res);
          resolve(result);
        });
      };
    });
    // 2. 真正的生成器函数：前一个函数的 res 作为后一个函数的参数
    let res;
    for (let i = 0; i < fns.length; i++) {
      res = yield newFns[i](res);
    }
  }

  /**
   * @description: 自动化执行函数(递归)
   * @param {Object} res { done: Boolean, value: Promise 对象 / undefined }
   */
  function exec(res) {
    const result = generator.next(res);
    if (result.done) return;
    result.value.then(res => {
      exec(res);
    });
  }

  const generator = composeFns(fns);
  exec();
}
