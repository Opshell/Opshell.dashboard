import { getCurrentInstance, ComponentInternalInstance } from 'vue';
export default () => (getCurrentInstance() as ComponentInternalInstance).appContext.config.globalProperties;