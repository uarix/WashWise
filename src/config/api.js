/**
 * API 配置文件
 * 统一管理所有 API 相关的配置
 */

// 从环境变量获取 API 基础 URL
// 开发环境: http://localhost:8000
// 生产环境: 使用相对路径 '' (通过 Nginx 反向代理)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// API 版本
export const API_VERSION = 'v1';
export const API_VERSION_V2 = 'v2';

// API 端点 - v1 版本 (已废弃，建议使用 v2)
export const API_ENDPOINTS = {
    // 获取洗衣房机器列表
    getLaundryMachines: (laundryId) =>
        `${API_BASE_URL}/api/${API_VERSION}/getLaundryMachines?LaundryID=${laundryId}`,

    // 获取机器详情
    getMachineDetail: (machineId) =>
        `${API_BASE_URL}/api/${API_VERSION}/getMachineDetail?MachineID=${machineId}`,
};

// API 端点 - v2 版本 (推荐使用)
export const API_ENDPOINTS_V2 = {
    // 获取店铺列表
    getShops: () => `${API_BASE_URL}/api/${API_VERSION_V2}/shops`,

    // 获取洗衣机列表
    getMachines: (shopId) =>
        `${API_BASE_URL}/api/${API_VERSION_V2}/machines?shopId=${shopId}`,

    // 获取洗衣机详情
    getMachineDetail: (machineId) =>
        `${API_BASE_URL}/api/${API_VERSION_V2}/machine/${machineId}`,

    // 点赞洗衣机
    likeMachine: (machineId) =>
        `${API_BASE_URL}/api/${API_VERSION_V2}/machine/${machineId}/like`,

    // 点踩洗衣机
    dislikeMachine: (machineId) =>
        `${API_BASE_URL}/api/${API_VERSION_V2}/machine/${machineId}/dislike`,
};

// 请求超时时间 (毫秒)
export const REQUEST_TIMEOUT = 10000;

// 默认请求配置
export const DEFAULT_FETCH_OPTIONS = {
    headers: {
        'Content-Type': 'application/json',
    },
};

