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

// API 端点
export const API_ENDPOINTS = {
    // 获取洗衣房机器列表
    getLaundryMachines: (laundryId) =>
        `${API_BASE_URL}/api/${API_VERSION}/getLaundryMachines?LaundryID=${laundryId}`,

    // 获取机器详情
    getMachineDetail: (machineId) =>
        `${API_BASE_URL}/api/${API_VERSION}/getMachineDetail?MachineID=${machineId}`,
};

// 请求超时时间 (毫秒)
export const REQUEST_TIMEOUT = 10000;

// 默认请求配置
export const DEFAULT_FETCH_OPTIONS = {
    headers: {
        'Content-Type': 'application/json',
    },
};

