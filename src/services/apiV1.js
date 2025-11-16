/**
 * API v1 请求服务
 * 封装所有 v1 版本的 API 请求函数
 * @deprecated 建议使用 v2 版本 API
 */

import {
    API_ENDPOINTS,
    REQUEST_TIMEOUT,
    DEFAULT_FETCH_OPTIONS,
} from '../config/api';

/**
 * 通用请求函数
 * @param {string} url - 请求 URL
 * @param {object} options - fetch 配置选项
 * @returns {Promise} 返回响应数据
 */
const request = async (url, options = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
        const response = await fetch(url, {
            ...DEFAULT_FETCH_OPTIONS,
            ...options,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('请求超时');
        }
        throw error;
    }
};

/**
 * 获取洗衣房机器列表
 * @param {string} laundryId - 洗衣房 ID
 * @returns {Promise<Object>} 机器列表
 * @deprecated 建议使用 v2 版本的 getMachines
 */
export const getLaundryMachines = async (laundryId) => {
    if (!laundryId) {
        throw new Error('洗衣房 ID 不能为空');
    }
    return await request(API_ENDPOINTS.getLaundryMachines(laundryId));
};

/**
 * 获取机器详情
 * @param {string|number} machineId - 机器 ID
 * @returns {Promise<Object>} 机器详情
 * @deprecated 建议使用 v2 版本的 getMachineDetail
 */
export const getMachineDetail = async (machineId) => {
    if (!machineId) {
        throw new Error('机器 ID 不能为空');
    }
    return await request(API_ENDPOINTS.getMachineDetail(machineId));
};

// 默认导出所有 API 函数
export default {
    getLaundryMachines,
    getMachineDetail,
};

