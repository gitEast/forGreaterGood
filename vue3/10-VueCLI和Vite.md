<!--
 * @Author: East
 * @Date: 2021-11-09 20:55:59
 * @LastEditTime: 2021-11-09 21:27:19
 * @LastEditors: Please set LastEditors
 * @Description: VueCLI 和 Vite
 * @FilePath: \forGreaterGood\vue3\10-VueCLI和Vite.md
-->

# Vue CLI 和 Vite

## Vue CLI

> 在真实项目中，我们不可能每一个项目都从头来完成所有的 webpack 配置，通常使用脚手架来创建一个项目

### 介绍

- 全称：Command-Line Interface，命令行界面
- 通过 CLI 选择项目的配置和创建项目
- Vue CLI 已经内置了 webpack 相关的配置

### 安装与使用

- Vue CLI 是一个工具，所以需要安装
  - 全局安装 --> 在任何时候都可以通过 vue 的命令来创建项目
- 安装：`npm install @vue/cli -g`
- 升级：`npm update @vue/cli -g`
- 创建：`vue create [项目名称]`

## Vite

## 补充

- 为什么通过 @vue/cli 创建项目用的是 `vue create [项目名称]` 而不是 `@vue/cli create`？
  - 安装 @vue/cli 之后，配置了 package.json 文件，.bin 配置选项中写了 `bin: { 'why': 'bin/xxxx.js' }`，敲 why，实际执行的是 bin/xxx.js 文件
