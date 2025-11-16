/**
 * API 服务统一导出
 */

// 导出 v2 版本 API (推荐使用)
export * from './apiV2';

// 导出 v1 版本 API (已废弃)
export * as apiV1 from './apiV1';

// 默认使用 v2 版本
export { default } from './apiV2';

