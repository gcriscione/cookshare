import { ComponentCustomProperties } from 'vue';
import { VueSweetalert2 } from 'vue-sweetalert2';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $swal: VueSweetalert2;
  }
}

/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
