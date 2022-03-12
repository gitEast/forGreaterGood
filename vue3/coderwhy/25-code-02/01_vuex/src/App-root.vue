<!--
 * @Author: your name
 * @Date: 2021-11-21 11:44:26
 * @LastEditTime: 2021-11-21 14:33:55
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\25-code-02\01_vuex\src\App.vue
-->
<template>
  <div>
    <h2>{{ $store.state.rootCounter }}</h2>
    <h2>{{ $store.state.user.userCounter }}</h2>
    <h2>{{ $store.state.home.homeCounter }}</h2>
    <button @click="homeIncrement">home+1</button>
    <h2>
      home 模块 getters 中的 doubleHomeCounter：{{
        $store.getters.doubleHomeCounter
      }}
    </h2>
    <hr />
    <h2>使用了 namespaced</h2>
    <h2>
      home 模块 getters 中的 doubleHomeCounter：{{
        $store.getters["user/doubleUserCounter"]
      }}
    </h2>
    <button @click="userIncrement">user+1</button>
  </div>
</template>

<script>
export default {
  name: "App",
  setup() {
    return {};
  },
  methods: {
    homeIncrement() {
      this.$store.commit("increment");
    },
    userIncrement() {
      this.$store.commit("user/increment");
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
