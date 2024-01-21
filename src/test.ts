/**
 * @file test
 * @author svon.me@gmail.com
 */

import { createApp as create, defineComponent, h } from "vue";

import "ant-design-vue/dist/reset.css";
import "./styles/main.less";

import Demo from "./demo.vue";

import type { App } from "vue";


function App() {
  
  const app: App = create(Demo);
  app.mount("#app");;
}

setTimeout(App);
