<!--
 * @Author: your name
 * @Date: 2021-11-21 11:44:26
 * @LastEditTime: 2021-11-21 13:26:42
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\25-code-02\01_vuex\src\App.vue
-->
<template>
  <div>
    <h2>App</h2>
    <hr />
    <h2>store 的使用</h2>
    <h4>sCounter: {{ sCounter }}</h4>
    <!-- <h4>mapState 中的 counter: {{ counter }}</h4> -->
    <h4>mapState 中的 counter: {{ mapCounter }}</h4>
    <hr />
    <h2>Vuex 中的 actions</h2>
    <h4>当前计数：{{ mapCounter }}</h4>
    <button @click="increment">+1</button>
    <hr />
    <h4>banners: {{ $store.state.banners }}</h4>
  </div>
</template>

<script>
import { useStore, mapState } from "vuex";
import { computed } from "vue";
import axios from "axios";
export default {
  name: "App",
  setup() {
    const store = useStore();
    const sCounter = computed(() => store.state.counter);

    // const storeState = mapState(["name", "age", "counter"]);
    const storeState = mapState({
      mapName: "name",
      mapAge: "age",
      mapCounter: "counter",
    });
    const sStoreState = {};
    Object.keys(storeState).forEach((fnKey) => {
      const fn = storeState[fnKey].bind({ $store: store });
      sStoreState[fnKey] = computed(fn);
    });

    const increment = () => {
      store.dispatch("incrementAction", { addNum: 2 });
    };

    return {
      sCounter,
      ...sStoreState,
      increment,
    };
  },
  mounted() {
    // axios.get("http://123.207.32.32:8000/home/multidata").then((res) => {
    //   console.log(res);
    //   this.$store.commit("addBannerData", res.data.data.banner);
    // });
    this.$store.dispatch("getHomeMultiData");
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
