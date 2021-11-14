import { goTo } from './goTo';
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $goTo(message: string): void
  }
}
Vue.prototype.$goTo = goTo
// export default ({ app }, inject) => {
//   app.$goTo = goTo;
//   inject('goTo', goTo);
// };
