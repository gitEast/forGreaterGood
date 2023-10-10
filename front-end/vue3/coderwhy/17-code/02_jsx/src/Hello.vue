<!--
 * @Author: your name
 * @Date: 2021-11-13 16:57:42
 * @LastEditTime: 2021-11-13 17:05:47
 * @LastEditors: Please set LastEditors
 * @Description: 插槽用法
 * @FilePath: \forGreaterGood\vue3\17-code\02_jsx\src\Hello.vue
-->
<script>
export default {
  // setup() {
  //   return (props, context) => {
  //     console.log(context)
  //     return (
  //       <div>
  //         <h2>这是 hello 组件，下面是插槽</h2>
  //         { context.slots.default? context.slots.default(): <span>哈哈哈</span> }
  //       </div>
  //     )
  //   }
  // },
  render() {
    return (
      <div>
        <h2>这是 hello 组件，下面是插槽</h2>
        { this.$slots.default? this.$slots.default(): <span>哈哈哈</span> }
      </div>
    )
  }
}
</script>
