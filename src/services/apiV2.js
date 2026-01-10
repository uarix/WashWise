/**
 * API v2 请求服务
 * 封装所有 v2 版本的 API 请求函数
 */

import {
    API_ENDPOINTS_V2,
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
 * 获取店铺列表
 * @returns {Promise<{items: Array}>} 店铺列表
 * @example
 * const data = await getShops();
 * // data.items = [{ id: "1", name: "店铺1" }, ...]
 */
export const getShops = async () => {
    return await request(API_ENDPOINTS_V2.getShops());
};

/**
 * 获取洗衣机列表
 * @param {string} shopId - 店铺 ID
 * @returns {Promise<{items: Array}>} 洗衣机列表
 * @example
 * const data = await getMachines("shop123");
 * // data.items = [{ id: 1, name: "洗衣机1", status: 0, ... }, ...]
 */
export const getMachines = async (shopId) => {
    if (!shopId) {
        throw new Error('店铺 ID 不能为空');
    }
    return await request(API_ENDPOINTS_V2.getMachines(shopId));
};

/**
 * 获取洗衣机详情
 * @param {string|number} machineId - 洗衣机 ID
 * @returns {Promise<Object>} 洗衣机详情
 * @example
 * const detail = await getMachineDetail(123);
 * // { id: 123, name: "洗衣机1", status: 0, remainTime: 30, history: {...}, ... }
 */
export const getMachineDetail = async (machineId) => {
    if (!machineId) {
        throw new Error('洗衣机 ID 不能为空');
    }
    return await request(API_ENDPOINTS_V2.getMachineDetail(machineId));
};

/**
 * 点赞洗衣机
 * @param {string|number} machineId - 洗衣机 ID
 * @returns {Promise<void>}
 * @example
 * await likeMachine(123);
 */
export const likeMachine = async (machineId) => {
    if (!machineId) {
        throw new Error('洗衣机 ID 不能为空');
    }
    return await request(API_ENDPOINTS_V2.likeMachine(machineId));
};

/**
 * 点踩洗衣机
 * @param {string|number} machineId - 洗衣机 ID
 * @returns {Promise<void>}
 * @example
 * await dislikeMachine(123);
 */
export const dislikeMachine = async (machineId) => {
    if (!machineId) {
        throw new Error('洗衣机 ID 不能为空');
    }
    return await request(API_ENDPOINTS_V2.dislikeMachine(machineId));
};

/**
 * 注册通知
 * @param {string} email - 邮箱地址
 * @param {number} machineId - 洗衣机 ID（整数）
 * @returns {Promise<Object>} 注册结果
 * @example
 * await registerNotice("user@example.com", 123);
 */
export const registerNotice = async (email, machineId) => {
    if (!email) {
        throw new Error('邮箱地址不能为空');
    }
    if (!machineId) {
        throw new Error('洗衣机 ID 不能为空');
    }
    // 确保 machineId 是整数类型
    const machineIdInt = typeof machineId === 'number' ? machineId : parseInt(machineId, 10);
    if (isNaN(machineIdInt)) {
        throw new Error('洗衣机 ID 必须是有效的整数');
    }
    return await request(API_ENDPOINTS_V2.registerNotice(), {
        method: 'POST',
        body: JSON.stringify({ email, machineId: machineIdInt }),
    });
};

/**
 * 获取通知列表
 * @param {string} email - 邮箱地址
 * @returns {Promise<{items: Array}>} 通知列表
 * @example
 * const data = await getNotices("user@example.com");
 * // data.items = [{ id: 1, email: "...", machineId: 123, ... }, ...]
 */
export const getNotices = async (email) => {
    if (!email) {
        throw new Error('邮箱地址不能为空');
    }
    return await request(API_ENDPOINTS_V2.getNotices(email));
};

/**
 * 取消通知
 * @param {string|number} noticeId - 通知 ID
 * @returns {Promise<void>}
 * @example
 * await cancelNotice(123);
 */
export const cancelNotice = async (noticeId) => {
    if (!noticeId) {
        throw new Error('通知 ID 不能为空');
    }
    return await request(API_ENDPOINTS_V2.cancelNotice(noticeId), {
        method: 'POST',
    });
};

// 默认导出所有 API 函数
export default {
    getShops,
    getMachines,
    getMachineDetail,
    likeMachine,
    dislikeMachine,
    registerNotice,
    getNotices,
    cancelNotice,
};

