/**
 * API v2 类型定义
 */

/**
 * 店铺信息
 */
export interface ShopItem {
    /** 店铺 ID */
    id: string;
    /** 店铺名称 */
    name: string;
}

/**
 * 获取店铺列表响应
 */
export interface GetShopsResponse {
    /** 店铺列表 */
    items: ShopItem[];
}

/**
 * 洗衣机信息
 */
export interface MachineItem {
    /** 洗衣机 ID */
    id: number;
    /** 点赞数 */
    like: number;
    /** 状态消息 */
    msg: string;
    /** 洗衣机名称 */
    name: string;
    /** 剩余时间（分钟） */
    remainTime: number;
    /** 状态码 */
    status: number;
    /** 洗衣机类型 */
    type: string;
    /** 使用次数 */
    usageCount: number;
}

/**
 * 获取洗衣机列表响应
 */
export interface GetMachinesResponse {
    /** 洗衣机列表 */
    items: MachineItem[];
}

/**
 * 洗衣机详情
 */
export interface MachineDetail {
    /** 洗衣机 ID */
    id: number;
    /** 洗衣机名称 */
    name: string;
    /** 洗衣机类型 */
    type: string;
    /** 状态码 */
    status: number;
    /** 状态消息 */
    msg: string;
    /** 剩余时间（分钟） */
    remainTime: number;
    /** 点赞数 */
    like: number;
    /** 平均使用时间（秒），即预计使用时间 */
    avgUseTime: number;
    /** 上个人开始使用时间（时间戳） */
    lastUseTime: number;
    /** 历史使用记录，日期 -> 使用次数 */
    history: Record<string, number>;
}

/**
 * 获取店铺列表
 * @returns 店铺列表
 * @example
 * const data = await getShops();
 * // data.items = [{ id: "1", name: "店铺1" }, ...]
 */
export function getShops(): Promise<GetShopsResponse>;

/**
 * 获取洗衣机列表
 * @param shopId - 店铺 ID
 * @returns 洗衣机列表
 * @throws 当店铺 ID 为空时抛出错误
 * @example
 * const data = await getMachines("shop123");
 * // data.items = [{ id: 1, name: "洗衣机1", status: 0, ... }, ...]
 */
export function getMachines(shopId: string): Promise<GetMachinesResponse>;

/**
 * 获取洗衣机详情
 * @param machineId - 洗衣机 ID
 * @returns 洗衣机详情
 * @throws 当洗衣机 ID 为空时抛出错误
 * @example
 * const detail = await getMachineDetail(123);
 * // { id: 123, name: "洗衣机1", status: 0, remainTime: 30, history: {...}, ... }
 */
export function getMachineDetail(machineId: string | number): Promise<MachineDetail>;

/**
 * 点赞洗衣机
 * @param machineId - 洗衣机 ID
 * @returns Promise
 * @throws 当洗衣机 ID 为空时抛出错误
 * @example
 * await likeMachine(123);
 */
export function likeMachine(machineId: string | number): Promise<void>;

/**
 * 点踩洗衣机
 * @param machineId - 洗衣机 ID
 * @returns Promise
 * @throws 当洗衣机 ID 为空时抛出错误
 * @example
 * await dislikeMachine(123);
 */
export function dislikeMachine(machineId: string | number): Promise<void>;

/**
 * 默认导出所有 API 函数
 */
declare const apiV2: {
    getShops: typeof getShops;
    getMachines: typeof getMachines;
    getMachineDetail: typeof getMachineDetail;
    likeMachine: typeof likeMachine;
    dislikeMachine: typeof dislikeMachine;
};

export default apiV2;

