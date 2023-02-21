# 数据结构与算法

编程尽头，数据结构。—— coderwhy

- 编程的目的：对数据进行处理
  - 开发能力的重要指标：以什么样的方式存储和处理数据更加方便、高效
- 数据结构与算法的本质：**一门专门研究数据如何组织、存储和操作的科目**
  - Nicklaus Wirth: Algorithm + Data Structures = Programs
- 数据结构
  - 组织和管理数据的方式
  - 常见的数据结构
    - 数组 Array
    - 栈结构 Stack
    - 队列 Queue
    - 链表 LinkedList
    - 堆结构 Heap
    - 树结构 Tree
    - 散列表(哈希表) Hash
    - 图结构 Graph
- 算法
  - 解决问题的方法和步骤
  - 定义
    - 一个有限的指令集，每条指令的描述不依赖于语言
    - 接受一些输入(有些情况不需要输入)
    - 产生输出
    - 在有限步骤之后终止

## 一、线性结构 - 数组

### 1.1 线性结构 Linear List

- 定义
  - 由 n(n>=0) 个数据元素(结点) a[0], a[1], a[2], ..., a[n-1] 组成的有限序列
- 分类
  - 受限的线性结构
    - 栈
    - 队列
  - 不受限的线性结构
    - 数组
    - 链表

### 1.2 数组 Array 结构

- 重要的数据结构
  - 几乎每种编程语言都会提供的一种**原生数据结构**
  - 可以借助于数组来实现其他的数据结构，如 Stack, Queue, Heap
- 内存连续(通常情况下)

  - if 知道下标值 -> 访问效率非常高

- 补充知识
  1. 早期的 JS 实现数组时，内存不是连续的：以类似链表的方式实现

## 二、栈结构 Stack

### 2.1 特性

- 受限的线性结构
  - 可以在数组的**任意位置**插入和删除数据 => 对这种任意性加以限制
  - => 后进先出 Last In First Out LIFO
- 概念
  - 栈顶 -- 栈底
  - 进栈/入栈/压栈 -- 出栈/退栈

### 2.2 代码实现

- 常见操作
  - `push(element)`: 入栈
  - `pop()`: 出栈
  - `peek()`: 返回栈顶元素，不对栈做任何修改
  - `isEmpty(): boolean`
  - `size()`
- 定义栈的接口 IStack
  ```ts
  interface IStack<T> {
    push(element: T): void;
    pop(): T | undefined;
    peek(): T | undefined;
    isEmpty(): boolean;
    size(): number;
  }
  ```

#### 2.2.1 ArrayStack 基于数组实现

```ts
class ArrayStack<T> implements IStack<T> {
  private data: T[] = [];

  push(element: T): void {
    this.data.push(element);
  }
  pop(): T | undefined {
    return this.data.pop();
  }
  peek(): T | undefined {
    return this.data[this.data.length - 1];
  }
  isEmpty(): boolean {
    return this.data.length === 0;
  }
  size(): number {
    return this.data.length;
  }
}
```

#### 2.2.2 LinkedStack 基于链表实现

TODO

### 2.3 笔试题

#### 2.3.1 十进制转二进制

```ts
function decimalToBinary(decimal: number): string {
  const stack = new ArrayStack<number>();

  while (decimal > 0) {
    stack.push(decimal % 2);
    decimal = Math.floor(decimal / 2);
  }

  let res = '';
  while (!stack.isEmpty()) {
    res += stack.pop()!;
  }

  return res;
}
```

#### 2.3.2 有效的括号

```ts
function isValid(s: string): boolean {
  const stack = new ArrayStack<string>();
  const len = s.length;
  for (let i = 0; i < len; i++) {
    switch (s[i]) {
      case '(':
        stack.push(')');
        break;
      case '[':
        stack.push(']');
        break;
      case '{':
        stack.push('}');
        break;
      default:
        if (s[i] !== stack.pop()) {
          return false;
        }
        break;
    }
  }
  return stack.isEmpty();
}
```

## 三、队列结构 Queue

### 3.1 特性

- 受限的线性结构
  - 先进先出 First In First Out
    - 在树的层序遍历中使用
- 概念
  - 前端 front
  - 后端 rear

### 3.2 代码实现

- 常见操作
  - `enqueue(element)`：入队
  - `dequeue()`：出队
  - `peek()`：队列第一个元素
  - `isEmpty()`
  - `size()`
- 定义队列的接口 IQueue
  ```ts
  interface IQueue<T> {
    enqueue(element: T): void;
    dequeue(): T | undefined;
    peek(): T | undefined;
    isEmpty(): boolean;
    size(): number;
  }
  ```

#### 3.2.1 基于数组实现

```ts
class ArrayQueue<T> implements IQueue<T> {
  private data: T[] = [];

  enqueue(element: T): void {
    this.data.push(element);
  }
  dequeue(): T | undefined {
    return this.data.shift();
  }
  peek(): T | undefined {
    return this.data[0];
  }
  isEmpty(): boolean {
    return this.data.length === 0;
  }
  size(): number {
    return this.data.length;
  }
}
```

#### 3.2.1 基于链表实现

> 更合适

### 3.3 笔试题

#### 3.3.1 击鼓传花

> 一组数据，每次数到 n 的人淘汰，直至剩下最后一个人

```ts
// 烫手山芋（笑
function hotPotato(names: string[], num: number): number {
  if (names.length === 0) return -1;

  const queue = new ArrayQueue<string>();

  for (const name of names) {
    queue.enqueue(name);
  }

  while (queue.size() > 1) {
    for (let i = 1; i < num; i++) {
      queue.enqueue(queue.dequeue()!);
    }
    queue.dequeue();
  }

  const leftName = queue.dequeue()!;
  const index = names.findIndex((name) => name === leftName);
  return index;
}
```

#### 3.3.2 约瑟夫环

```ts
function lastRemaining(n: number, m: number): number {
  const queue = new ArrayQueue<number>();
  for (let i = 1; i < n + 1; i++) {
    queue.enqueue(i);
  }

  while (queue.size() > 1) {
    for (let i = 1; i < m; i++) {
      queue.enqueue(queue.dequeue()!);
    }
    queue.dequeue();
  }

  return queue.dequeue()!;
}
```

## 四、链表结构 LinkedList

### 4.3 总结

> 对 Array, Stack, Queue, LinkedList 进行对比

|                      | Array | Stack      | Queue      | LinkedList |
| -------------------- | ----- | ---------- | ---------- | ---------- |
| 在任意位置插入和删除 | √     | × 后进先出 | × 先进后出 | √          |

- 抽取相同的接口 IList

## 八、高阶队列

### 8.1 双端队列(双向队列)

### 8.2 优先级队列 Priority Queue

- 概念
  - 通过优先级的大小，决定出队顺序
  - 实现 by：数组、链表、堆...
    - **堆**，最常用的实现方式
- 实现
  1. PriorityNode(可为任意类)
     - 方法
       - `valueOf()`: 用于比较大小(js 的特性)
  2. PriorityQueue
     - 属性
       - `heap: Heap<PriorityNode>`
     - 方法
       - `enqueue(value)`：入队
       - `dequeue(): T | undefined`
       - `peek()`
       - `isEmpty()`
       - `size()`

## 九、平衡二叉树

- 平衡树 Balanced Tree
  - 一种特殊的二叉搜索树
  - 目的：通过一些特殊的技巧来维护**树的平衡**，从而保证树的搜索、插入、删除等操作的时间复杂度都很低
    - if 平衡，时间复杂度 O(logN)
    - if 不平衡，-> 近似链表结构 -> 时间复杂度 O(N)
- 保持平衡的方法
  1. 限制插入、删除的节点(不允许这样的操作) --> 真是个大聪明...
  2. 随机插入 or 删除后，通过某种方式观察树是否平衡
     - if 不平衡，通过特定的方式，让树保持平衡
- 常见的平衡二叉搜索树
  - AVL 树
    - 搜索效率高于红黑树，但插入和删除操作效率低于红黑树
    - 通常用于各种需要**高效查询的数据结构**
  - 红黑树
    - 被广泛用于操作系统内核、数据库、编译器等软件中的数据结构
    - 原因：插入、删除、查找操作都具有较低的时间复杂度
  - Splay 树
  - Treap
  - B-树

### 9.1 AVL 树

- 概念
  - 由 G.M.Adelson-Velsky 和 E.M.Landis 在 1962 年发明
  - 一种**自平衡二叉树**
    - 二叉搜索树的一个变体
    - 在保证二叉搜索树性质的同时，通过**旋转**操作保证树的平衡
  - 权值
    - 每个节点都有一个权值，该权值代表了已该节点为根节点的左右子树高度差
    - 在 AVL 树中，任意节点的权值只有三种可能：1 or -1 or 0
    - 又名 平衡因子
  - 三个节点
    - grand/root
    - 轴心 Pivot / parent
    - current
- 实现
  - AVLTreeNode
    - 属性
      - `value`
      - `left`
      - `right`
      - `parent`
    - 方法
      - `getHeight()`：获取每个节点的高度
      - `getBalanceFactor()`：权重，左边高度 - 右边高度
      - **`get isBalanced()`：直接判断当前节点是否平衡**
      - `public get higherChild()`：获取高度更高的子节点
        - if leftChildHeight === rightChildHeight, 当前节点为左子节点就返回 this.left，否则 this.right
          - 一般做法
          - 实际上如果左右子树高度相等，基本不会来到这个函数
      - `rightRotation()`：右旋转(this === root)
    - 可以直接继承自 TreeNode
  - AVLTree
    - 树的情况与旋转：(从不平衡节点自上而下观察)
      1. 左左情况 -> 右旋
         - root.left + pivot.left
         1. 处理 pivot
         2. 处理 pivot.right
         3. 处理 root
         4. 处理 pivot 的挂载(不同情况)
            1. pivot.parent 为 `undefined` or `null`
            2. pivot 是父节点的左子节点
            3. pivot 是父节点的右子节点
      2. 右右情况 -> 左旋
      3. 左右情况 -> 左旋，右旋
      4. 右左情况 -> 右旋，左旋
    - 方法
      - `rebalance(root: AVLTree<T>)`：根据不平衡节点的情况(LL/RR/LR/RL)让子树平衡
      - `protected createNode(value: T): AVLTreeNode<T>`：模板模式
      - 重构二叉搜索树的 `insert` 方法
      - `checkBalance(node: AVLTreeNode<T>)`：模板方法 again
        - 添加与删除导致的优化
      - 重构二叉搜索树的 `delete` 方法

### 9.2 红黑树 Red-black Tree

- 概念
  - 1972 年由鲁道夫·贝尔发明，被称为**对称二叉 B 树**
  - 一种自平衡二叉查找树
  - 特性
    1. 节点是红色 or 黑色
    2. 根节点是黑色的
    3. 每个叶子节点都是黑色的空节点 (NIL 节点，空节点)
       - because 在红黑树中，黑色节点的数量表示从根节点到该节点的黑色节点数量
    4. 每个红色节点的两个子节点都是黑色(从每个叶子到根的所有路径上不能有两个连续的红色节点)
       - 保证红色节点的颜色不会影响树的平衡
       - 保证红色节点的出现不会导致连续的红色节点
    5. **从任一节点到其每个叶子节点的所有路径都包含相同数目的黑色节点**
       - in order to 保证红黑树的平衡性
       - 前面的性质可以说都是为这一条服务
    - => 确保了红黑树的关键特性：从根到叶子的最长可能路径，不会超过最短可能路径的两倍长。原因如下：
      - 性质 5 决定了最长路径和最短路径必须拥有相同的黑色节点数量
      - 路径最短时：全部是黑色节点 n 个
      - 路径最长时：黑色节点 n 个，红色节点 n - 1 个
        - 性质 2：根节点是黑色的
        - 性质 3：叶子节点都是黑色的
        - 性质 4：两个红色节点不能相连
      - so 最短路径：n - 1
      - so 最长路径： n + (n - 1) - 1 = 2n - 2 = 2(n - 1)
- 性能分析
  - AVL 树是一种平衡度更高的二叉搜索树 => 搜索效率：AVL 树更高，红黑树更低
  - 但 AVL 树为了维护这种平衡性，在插入和删除操作时，通常会进行更多的旋转操作 => 效率比红黑树较低
  - 它们的搜索、删除、添加时间复杂度都是 O(logn)，但在细节上会有一些差异
  - => 红黑树综合效率更高

### 9.3 AVL 树 和 红黑树的区别

| 性质     | AVL 树          | 红黑树   |
| -------- | --------------- | -------- |
| 节点标识 | 权值            | 颜色     |
| 平衡性   | -1 <= 权值 <= 1 | 基本平衡 |

## 十、排序算法 Sorting Algorithm

- 定义：
  - 通俗：研究如何对一个集合进行高效排序的算法
  - 维基：在计算机科学与数学中，一个排序算法是一种能将一串资料按照特定排序方式排列的算法
- 重要且耗时
  - => 计算机科学中广泛的课题，有一套成熟的方案
- 分类标准
  - 计算的时间复杂度：使用大 O 表示法，也可以实际测试消耗的时间
  - 内存使用量(甚至其他电脑资源)：比如外部排序，使用磁盘来存储排序数据
  - 稳定性：稳定排序算法会让原本有相等键值的记录维持相对次序
  - 排序的方法：插入、交换、选择、合并等等

### 10.1 冒泡排序 Bubble Sort

#### 10.1.1 思路

![冒泡排序图解](./imgs/10-1_%E5%86%92%E6%B3%A1%E6%8E%92%E5%BA%8F.png)

1. 通过两两比较相邻的元素并交换它们的位置，从而使整个序列按照顺序排列
2. 该算法一趟排序后，最大值总会移到数组最后面，那么接下来就不用再考虑这个最大值
3. 一直重复这样的操作，最终就可以得到排序完成的数组

=> 最大的元素会经由交换慢慢“浮”到数组的尾端，故名“冒泡排序”

#### 10.1.2 代码

- es6 交换代码：`[m, n] = [n, m]`
- 如果在前一轮没有交换，则代表数组已经有序，无需再比较

#### 10.1.3 总结

- 时间复杂度
  - 最好情况：O(n)
  - 最坏情况：O(n²)
  - 平均情况：O(n²)
- 冒泡排序适用于数据规模较小的情况，对于大数据量的排序会变得很慢
- 实现简单、容易理解，适用于学习排序算法的初学者
- 在实际应用中，冒泡排序效率很低，并不常用
  - 会被其他更高效的排序算法所替代，如快速排序、归并排序...

### 10.2 选择排序 Selection Sort

#### 10.2.1 思路

1. 在未排序的数列中找到最小(大)元素，然后将其存放到数列的起始位置
2. 再从剩余未排序的元素中继续寻找最小(大)元素，然后放到已排序序列的末尾
3. 以此类推，直至所有元素均排序完毕

#### 10.2.2 代码

#### 10.2.3 总结

- 时间复杂度
  - 最好情况：O(n²)
  - 最坏情况：O(n²)
  - 平均情况：O(n²)
- 适用于数据规模较小的情况，对于大数据量的排序会变得很慢
- 实现简单、容易理解，适用于学习排序算法的初学者
- 在实际应用中，效率很低，并不常用
  - 会被其他更高效的排序算法所替代，如快速排序、归并排序...

### 10.3 插入排序 Insertion Sort

#### 10.3.1 思路

1. 假设数组的第一个元素已经排好序了
2. 从第二个元素开始，不断与前面的有序数组元素进行比较
3. 如果当前元素小于前面的有序数组元素，则把当前元素插入到前面的合适位置
4. 否则继续与有序数组元素进行比较
5. 以此类推，以至整个数组都有序
6. 循环步骤 2-5，直至最后一个元素

#### 10.3.2 代码

#### 10.3.3 总结

- 时间复杂度
  - 最好情况：O(n)
  - 最坏情况：O(n²)
  - 平均情况：O(n²)
- 效率比较
  - if 数组部分有序，插入排序可以比冒泡和选择更快
  - if 数组完全逆序，则插入排序的时间复杂度更高

### 10.4 **归并排序 Merge Sort**

熟练程度：掌握

#### 10.4.1 思路

1. 将待排序的数组分成若干个子数组
2. 将相邻的子数组归并成一个有序数组
3. 将这些有序数组归并(merge)成一个整体有序的数组

- 分治法：将大问题分解成小问题

#### 10.4.2 代码

#### 10.4.3 总结

- 时间复杂度
  - 最好情况：O(logn)
  - 最坏情况：O(nlogn)
  - 平均情况：O(nlogn)
- 一种非常高效的排序算法
  - 核心思想：分治
- 需要额外的数组空间
  - 但在每次函数调用完即销毁

### 10.5 **快速排序 Quick Sort**

熟练程度：掌握

- 又称划分交换排序 Partition-exchange Sort

#### 10.5.1 思路

- 基于分治思想

1. 将一个大数组分成两个小数组，递归地对两个小数组进行排序
2. 选择一个基准元素(pivot)，将数组分成左右两部分，左部分的元素都 <= 基准元素，右部分的元素都 > 基准元素
3. 对左右两部分分别进行递归调用快速排序
4. 最终将整个数组排序

#### 10.5.2 代码

#### 10.5.3 总结

- 时间复杂度：主要取决于**基准元素的选择**、**数组的划分**、**递归深度**等因素
  - 最好情况：O(nlogn)
  - 最坏情况：O(n²)
    - 这种情况出现的概率非常小
    - 优化策略：三数取中法 or 随机选择基准元素
  - 平均情况：O(nlogn)
- 原地排序算法，不需要额外的数组空间

### 10.6 **堆排序 Heap Sort**

熟练程度：掌握

#### 10.6.1 思路

- 基于比较的排序算法，核心思想：使用二叉堆来维护一个有序序列
  - 常用最大堆(保证每个节点都比它的子节点大)

1. 首先构建一个最大堆
2. 将堆的根节点与堆的最后一个元素交换 => 最大值就被放在了正确的位置上
3. 将堆的大小 - 1，并将剩余元素重新构建成一个最大堆
4. 不断重复这个过程，直到堆的大小为 1
5. => 得到一个有序的序列

- 堆排序与选择排序有一定的关系，都利用了“选择”这个基本操作
- 时间复杂度：O(nlogn)
- 空间复杂度：O(1)

#### 10.6.2 代码

#### 10.6.3 总结

- 高效的排序算法
- 但排序过程不稳定
- 可以应用于大规模数据的排序

### 10.7 希尔排序 Shell Sort

#### 10.7.1 思路

1. 定义一个增量序列 d1, d2, ..., dk，一般增量序列最后一个元素为 1，即 dk = 1
2. 以 dk 为间隔将待排序的序列分成 dk 个子序列，对每个子序列进行插入排序
3. 缩小增量，对缩小后的每个子序列进行插入排序，直到增量为 1

- 增量选择
  - Hibbard 增量序列
    - 增量算法：2^k - 1
    - 最坏复杂度：O(N^3/2)；平均复杂度：O(N^5/4)
  - Sedgewick 增量序列
    - 增量算法：`9*4^i - 9*2^i + 1`
    - 最坏复杂度：O(N^4/3)；平均复杂度：O(N^7/6)

#### 10.7.2 代码

#### 10.7.3 总结

- 从历史角度而言，是一种非常重要的排序算法，解除了人们对于排序算法时间复杂度 O(n²) 的固有认知
- 时间复杂度取决于步长序列的选择，目前最优的步长序列仍未被证明，因此该排序算法的时间复杂度依然是一个开放的问题

## 十四、动态规划 Dynamic Programming

简称 DP

### 14.1 概念

- 定义
  - 维基：是一种在数学、管理科学、计算机科学、经济学和生物信息学中使用的，通过把原问题分解为相对简单的子问题的方式求解复杂问题的方法。
    - 分而治之：子问题互相独立
    - 动态规划：第二个问题求解时需要用到第一个问题的解 => 即，各个问题之间相互有联系
- 核心思想：将问题划分为若干个子问题，并在计算子问题的基础上，逐步构建出原问题的解
- 步骤：
  1. 定义状态
     - 表示子问题的解
  2. 确定状态转移方程
  3. 初始化状态
  4. 计算原问题的解(最终答案)

### 14.2 认识动态规划

> 以斐波那契数列为例

1. 递归算法
2. 记忆化搜索 Memorization
   - 将结果存储在某一个数组中
   ```ts
   function fib(n: number, memo: number[] = []): number {
     // f(0) 和 f(1)
     if (n <= 1) return n;
     if (!memo[n]) memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
     return memo[n];
   }
   ```
3. 动态规划
   ```ts
   function fib(n: number) {
     const memo: number[] = [];
     for (let i = 0; i <= n; i++) {
       if (i <= 1) memo[i] = i;
       else memo[i] = memo[i - 1] + memo[i - 2];
     }
     return memo[n];
   }
   ```
   1. 定义状态：dp 数组保留斐波那契数列中每一个位置对应的值(状态)
      - dp[x] 表示 x 位置对应的值(状态)
   2. 状态转移方程：dp[i] = dp[i - 1] + dp[i - 2]
      - 一般写在循环中
   3. 设置初始化状态：dp[0]/dp[1]
   4. 计算最终的结果
   ```ts
   // 最终版
   function fib(n: number) {
     const dp: number[] = [0, 1];
     for (let i = 2; i <= n; i++) {
       dp[i] = dp[i - 1] + dp[i - 2];
     }
     return dp[n];
   }
   ```
4. 动态规划 - 状态压缩
   - f(n) = f(n - 1) + f(n - 2)
   ```ts
   function fib(n: number): numbaer {
     if (n <= 1) return n;
     let prev = 0;
     let current = 1;
     for (let i = 2; i <= n; i++) {
       const newValue = prev + current;
       prev = current;
       current = prev;
     }
     return current;
   }
   ```

### 14.3 案例练习

1. 爬楼梯(跳台阶)
2. 买卖股票的最佳时机
3. 最大子数组和
