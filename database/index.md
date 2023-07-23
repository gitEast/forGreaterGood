# MySQL 数据库

## 一、MySQL 介绍和安装

### 1.1 为什么需要数据库？

1. 需要存放大量的数据
2. 存储到文件系统中有较多缺点
   1. 难以用合适的方式组织数据(多张表之间的关系组织)
   2. 对数据进行增删改查中的复杂操作，保证单操作的原子性
   3. 难以进行数据共享
   4. 进行数据的高效、备份、迁移、恢复

- 一个存储数据的仓库
  - 本质：软件

### 1.2 常见数据库

- 关系型数据库
  - 举例：MySQL, Oracle, DB2, SQL Server, Postgre SQL...
  - 使用
    1. 通常会创建多个二维数据表
    2. 数据表之间相互关联起来，形成一对一、一对多、多对多等关系
    3. 再利用 SQL 语句在多张表中查询所需的数据
- 非关系型数据库
  - Not only SQL => 简称，NoSQL
  - 相较而言，非关系型数据库比较简单，存储数据也更加自由
  - 基于 Key-Value 的对应关系
  - 查询过程中不需要经过 SQL 解析
  - 查询方便，但数据冗余，修改麻烦
- 如何选择
  - 在公司进行后端开发时，以关系型数据库为主
  - 在爬取大量的数据进行存储时，常用非关系型数据库
- 一个数据库软件中可以创建多个数据库

### 1.3 安装

- 下载地址：[https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)
- 安装版本
  - 不同系统
    - Windows: MSI
    - Mac: DMG
  - 最新版本
- 环境变量配置 path 新增 `C:\Program Files\MySQL\MySQL Server 8.0\bin`
- 在 cmd 进入 MySQL 程序：`mysql -uroot -p`

### 1.4 默认数据库

- information_schema: 信息数据库，其中包括 MySQL 在维护的其他数据库、表、列、访问权限等信息
- performance_schema: 性能数据库，记录着 MySQL Server 数据库引擎在运行过程中的一些资源消耗相关信息
- mysql: 用于存储数据库管理者的用户信息、权限以及一些日志信息等
- sys: 相当于一个简易版的 performance_schema，将性能数据库中的数据汇总成更容易理解的形式

## 二、MySQL 连接和 GUI

### 2.1 终端操作

1. 创建数据库 `create database if not exists music_db;`
2. 进入某个数据库 `use music_db;`
3. 建表 `create table t_singer(name varchar(10), age int);`
4. 查看表 `show tables;`
5. 插入数据 `insert into t_singer (name, age) values ('容祖儿', 41);`
6. 查看数据 `select * from t_singer;`

### 2.2 GUI 工具

1. navicat

## 三、SQL 语句和数据类型

### 3.1 认识 SQL 语句

- SQL
  - Structured Query Language, 结构化查询语句，简称 SQL
  - 使用 SQL 编写的语句，称之为 SQL 语句
  - 作用：对数据库进行操作
- SQL 语句常用规范
  1. 关键字大写：`CREATE`, `TABLE`, `SHOW`
  2. 一条语句结束后，需要以 `;` 结尾
  3. if 遇到关键字作为表名 or 字段名称，可以使用 `` 包裹
- SQL 语句分类
  - DDL
    - Data Definition Language, 数据定义语言
    - 作用：对数据库 or 表进行创建、删除、修改等
  - DML
    - Data Manipulation Language, 数据操作语言
    - 作用：对表进行添加、删除、修改等
  - DQL
    - Data Query Language, 数据查询语言
    - 作用：从数据库表中查询记录
  - DCL
    - Data Control Language, 数据控制语言
    - 作用：对数据库表的权限进行相关访问控制操作

### 3.2 数据类型

1. 数字类型
   1. 整数
      | Type | Storage(bytes) | Minimum Value Signed | Maximum Value Singed | Minimum Value Unsigned | Maximum Value Unsigned |
      | ---- | -------------- | -------------------- | ---------------------- | -------------------- | ---------------------- |
      | TINYINT | 1 | -128 | 127 | 0 | 255 |
      | SMALLINT | 2 | -32768 | 32767 | 0 | 65535 |
      | MEDIUMINT | 3 | -8388608 | 8388607 | 0 | 16777215 |
      | INT | 4 | -2147483648 | 2147483647 | 0 | 4294967295 |
      | BIGINT | 8 | -2^63 | 2^63 - 1 | 0 | 2^64 - 1 |
   2. 浮点数
      - FLOAT: 4 个字节
      - DOUBLE: 8 个字节
   3. 精确数字类型
      - DECIMAL
      - NUMERIC
2. 日期和时间类型
   - YEAR: YYYY
   - DATE: YYYY-MM-DD
   - DATETIME: YYYY-MM-DD hh:mm:ss
   - 支持范围：1000-01-01 00:00:00 至 9999-12-31 23:59:59
   - TIMESTAMP: YYYY-MM-DD hh:mm:ss
   - 支持范围：1970-01-01 00:00:01 至 2038-01-19 03:14:07
3. 字符串类型(字符和字节)
   - CHAR
     - 固定长度，0-255
     - 被查询时，会删除后面的空格
   - VARCHAR
     - 可变长度的字符串，长度 0-65535
     - 被查询时，不会删除后面的空格
   - BINARY
     - 用于存储二进制字符串，存储的是字节字符串
   - VARBINARY
     - 存储字节字符串
   - BLOB
     - 用于存储大的二进制类型
   - TEXT
     - 大的字符串类型
4. 空间类型(新增)
5. JSON 类型(新增)

### 3.3 表约束

- 主键 Primary Key
  - 目的：为了区分每一条记录的唯一性，必须有一个字段是永远不会重复的，并且不为空
  - 表中唯一的索引
  - NOT NULL
    - 即使没有设置，MySQL 也会隐式地设置成 NOT NULL
  - 联合主键
    - 可以多列索引 PRIMARY KEY(key_part, ...)
  - 建议：开发中主键字段应该与业务无关，尽量不要使用业务字段作为主键
- 唯一 UNIQUE
  - 目的：某些字段在开发中希望是唯一的、不会重复的，比如手机号码、身份证号码等
  - 允许有多个 NULL 值
- 不能为空 NOT NULL
- 默认值 DEFAULT
- 自动递增 AUTO_INCREMENT
- 外键

### 3.4 SQL 语句 - DDL 语句

```sql
-- 1. 查看数据库
SHOW DATABASES;

-- 2. 使用某一个数据库
USE music_db;

-- 3. 查看目前正在使用的数据库
SELECT DATABASE();

-- 4. 创建某一个数据库
CREATE DATABASE test_demo;
-- 4.1 安全的创建语句
CREATE DATABASE IF NOT EXISTS test_demo;

-- 5. 删除某个数据库
DROP DATABASE test_demo;
-- 5.1 安全的删除语句
DROP DATABASE IF EXISTS test_demo;

-- 6. 查看当前数据库中的表
SHOW TABLES;

-- 7. 查看某一张表的结构
DESC t_singer;

-- 8. 创建一张新表
CREATE TABLE IF NOT EXISTS `users`(
  name VARCHAR(10),
  age INT,
  height DOUBLE
);
-- 8.1 创建完整的表结构
CREATE TABLE IF NOT EXISTS `users`(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(20) UNIQUE NOT NULL,
  level INT DEFAULT 0,
  telPhone VARCHAR(20) UNIQUE
);

-- 9. 修改表中某个字段
-- 9.1 修改表名
ALTER TABLE `users` RENAME TO `t_users`;
-- 9.2 添加新的字段
ALTER TABLE `t_users` ADD `createTime` TIMESTAMP;
-- 9.3 修改字段名称与类型
ALTER TABLE `t_users` CHANGE `createTime` `createAt` DATETIME;
-- 9.4 删除某个字段
ALTER TABLE `t_users` DROP `createAt`;
-- 9.5 修改某一字段类型
ALTER TABLE `t_users` MODIFY id BIGINT;

-- 10. 当修改某条数据时，使用最新的时间记录
ALTER TABLE `t_products` ADD `updateTime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
```

### 3.5 SQL 语句 - DML 语句

- 前置准备
  ```sql
  -- 新建商品表
  CREATE TABLE IF NOT EXISTS `t_products`(
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(20) UNIQUE NOT NULL,
    description VARCHAR(200) DEFAULT '',
    price DOUBLE DEFAULT 0,
    publishTime DATETIME
  );
  ```

```sql
-- 1. 插入数据
INSERT INT `t_products` (title, description, price, publishTime) VALUES ('iPhone', 'iPhone 12 green', 5600, '2018-05-06');

-- 2. 删除数据
-- 2.1 删除表中所有数据
DELETE FROM `t_products`;
-- 2.2 删除某条数据
DELETE FROM `t_products` WHERE id = 1;

-- 3. 修改数据
-- 3.1 修改表中所有数据
UPDATE `t_products` SET price = '5000';
-- 3.2 根据条件修改某一条数据
UPDATE `t_products` SET price = '5000' WHERE id = 2;
```

### 3.6 SQL 语句 - DQL 语句

```sql
-- 1. 查询所有的数据与其所有的字段
SELECT * FROM `t_products`;

-- 2. 查询所有数据并指定字段
SELECT id, brand, , title, price from `t_products`;
-- 2.1 给查询到的字段起别名(as 关键字可以省略)
SELECT id as pid, brand pbrand, , title, price from `t_products`;

-- 3. 查询条件
-- 3.1 WHERE
-- 3.1.1 比较运算符
SELECT * FROM `t_products` WHERE price <= 1000;
SELECT * FROM `t_products` WHERE price >= 3000;
-- 3.1.2 逻辑运算符
SELECT * FROM `t_products` WHERE price < 1000 AND brand = '小米';
SELECT * FROM `t_products` WHERE price < 1000 && brand = '小米';
SELECT * FROM `t_products` WHERE price > 5000 OR brand = 'Apple';
SELECT * FROM `t_products` WHERE price > 5000 || brand = 'Apple';
-- 3.1.3 区间范围
SELECT * FROM `t_products` WHERE price >= 1000 && price <= 2000;
SELECT * FROM `t_products` WHERE price BETWEEN 1000 AND 2000;
-- 3.1.4 枚举多个结果
SELECT * FROM `t_products` WHERE brand in ('小米', 'Apple');
-- 3.1.5 模糊查询: % 匹配任意个任意字符, _ 匹配一个任意字符
SELECT * FROM  `t_products` WHERE WHERE title LIKE 'v%'; -- 查询所有以 v 开头的
SELECT * FROM  `t_products` WHERE WHERE title LIKE '__M%'; -- M 必须是第三个字符

-- 3.2 排序
-- 3.2.1 升序 ASC
-- 3.2.2 降序 DESC
SELECT * FROM `t_products` WHERE price < 5000 ORDER BY score DESC;

-- 3.3 分页查询
SELECT * FROM `t_products` LIMIT 20 OFFSET 20;
-- 另一种写法: 先 offset 后 size
SELECT * FROM `t_products` LIMIT 20, 20;
```

## 四、MySQL 多表操作

### 4.1 MySQL 的聚合函数

- 定义：对 值的集合 进行操作的组(集合)函数

```sql
-- 1. 平均函数 AVG - 计算华为手机的平均价格
SELECT AVG(price) FROM `t_products` WHERE brand = '华为';

-- 2. 极值 MAX, MIN
SELECT MAX(score) FROM `t_products`;
SELECT MIN(score) FROM `t_products`;

-- 3. 数据总和 SUM
SELECT SUM(voteCnt) FROM `t_products`;

-- 4. 计算数据条数总和 COUNT: 为空时不计入
SELECT COUNT(title) FROM `t_products`;

-- 另外 分组 GROUP BY: 与聚合函数一起使用 - 根据
SELECT brand, MAX(price) AS max_price, MIN(price) AS min_price, ROUND(AVG(price), 2) AS avg_price FROM `t_products` GROUP BY brand;
SELECT brand, MAX(price) AS max_price, MIN(price) AS min_price, ROUND(AVG(price), 2) AS avg_price FROM `t_products` GROUP BY brand HAVING avg_price > 3000; -- 给 GROUP BY 加约束条件 HAVING
```

### 4.2 MySQL 的外键约束

- 设置属性
  - RESTRICT(default)
    - 当更新 or 删除某个记录时，会检查是否有关联的外键记录，if 有 => 报错，不允许更新 or 删除
  - NO ACTION
    - 和 RESTRICT 一致，在 SQL 标准中定义
  - CASCADE
    - 更新 or 删除某个记录时，会检查是否有关联的外键记录
      - 更新 => 更新对应的记录
      - 删除 => 关联的记录一起被删掉
  - SET NULL
    - 当更新 or 删除某个记录时，会检查是否有关联的外键记录，if 有 => 将对应的值置为 NULL

```sql
-- 1. 创建表时就引入外键约束
CREATE TABLE IF NOT EXISTS `songs` (
  id INT PRIMARY KEY AUTO_INCREMENT,
  singer_id INT,
  FOREIGN KEY (singer_id) REFERENCES singers(id)
);

-- 2. 表创建好之后再加入外键约束
ALTER TABLE songs ADD singer_id INT;
ALTER TABLE songs ADD FOREIGN KEY (singer_id) REFERENCES singers(id);
-- 2.1 更新 or 删除时的操作
ALTER TABLE songs ADD FOREIGN KEY (singer_id) REFERENCES singers(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- 3. 查看表中目前外键
SHOW CREATE TABLE `products`;
```

### 4.3 MySQL 的多表查询

```sql
-- 1. 笛卡尔乘积(直积): X * Y
SELECT * FROM songs, singers;

-- 2. 对应拼接，对无法匹配的数据进行过滤 - 反正就是不对
SELECT * FROM songs, singers WHERE songs.singer_id = singers.id;

-- 3. SQL JOIN
-- 3.1 左连接: 左边表的数据全部查询，右边依据条件拼接 [OUTER] 一般不写
SELECT * FROM songs LEFT [OUTER] JOIN singers ON songs.singer_id = singers.id;
SELECT * FROM songs LEFT [OUTER] JOIN singers ON songs.singer_id = singers.id WHERE singers.id IS NULL; -- 展示左边没有交集的数据
-- 3.2 右连接
SELECT * FROM songs RIGHT JOIN singers ON songs.singer_id = singers.id;
-- 3.3 内连接 [INNER/CROSS] JOIN 效果与 2 一样，两边的交集
SELECT * FROM songs INNER JOIN singers ON songs.singer_id = singers.id;
-- 3.4 外连接
-- 3.5 全连接: MySQL 没有实现，但可能通过 UNION 完成
(SELECT * FROM songs LEFT JOIN singers ON songs.singer_id = singers.id) UNION (SELECT * FROM songs RIGHT JOIN singers ON songs.singer_id = singers.id);
```

### 4.4 表与表之间的连接方式

### 4.5 多对多关系的关系表

> 多对多关系中，通常会建立一张关系表

### 4.6 多对多数据查询语句
