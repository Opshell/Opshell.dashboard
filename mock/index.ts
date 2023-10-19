import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';

// import MockMethod from './modules/user';

// 導入 Mock.js 库
// import Mock from 'mockjs';
// import axios from 'axios';

// 檢查 Docker API 是否可用
// async function checkDockerApi(url: string) {
//     try {
//         const response = await axios.get('/api/check-availability');

//         return response.data.backendAvailable;
//     } catch (error) {

//         return false; // 該 api 未建立
//     }
// }

// export async function setupProdMockServer() {
//     // 检查后端可用性
//     const backendAvailable = await checkDockerApi();

//     if (backendAvailable) {
//         // 后端可用，不设置 Mock 数据
//         createProdMockServer([]);
//     } else {
//         // 后端不可用，使用 Mock.js 模拟数据
//         createProdMockServer([...MockMethod]); // 导入 Mock.js 模块并配置你的模拟数据
//     }
// }


import MockMethod from './modules/user';

export function setupProdMockServer() {
    createProdMockServer([...MockMethod]);
}