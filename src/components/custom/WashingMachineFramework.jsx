import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { toast } from 'react-toastify';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Clock, Timer } from "lucide-react";
import WashingMachineCard from '@/components/custom/WashingMachineCard';
import { getMachineDetail, likeMachine, dislikeMachine } from '@/services/apiV2';

const WashingMachineFramework = ({
  machine,
  isFavorite,
  onToggleFavorite,
  usageTotal = 0
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [usageData, setUsageData] = useState([]);
  const [machineDetail, setMachineDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const transformData = (data) => {
    return Object.entries(data).map(([key, value]) => {
      return {
        day: key.slice(-2) + "号",
        uses: value,
        fullDate: key
      };
    });
  };

  // 自定义Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-blue-600">
            {`使用次数: ${payload[0].value}次`}
          </p>
        </div>
      );
    }
    return null;
  };

  // 动态颜色
  const getBarColor = (value, maxValue) => {
    const intensity = value / maxValue;
    if (intensity > 0.7) return '#059669'; // 高使用率 - 绿色
    if (intensity > 0.4) return '#0891b2'; // 中等使用率 - 蓝色
    return '#6b7280'; // 低使用率 - 灰色
  };

  // 获取机器详情
  const fetchMachineDetail = () => {
    setIsLoading(true);
    getMachineDetail(machine.id)
      .then(data => {
        setMachineDetail(data);
        setUsageData(transformData(data.history || {}));
        setIsLoading(false);
      })
      .catch(error => {
        console.error('getMachineDetail API Error: ', error);
        toast.error(
          '获取洗衣机详细信息失败: ' + error.message,
          {
            autoClose: 1000,
            closeOnClick: true,
            hideProgressBar: true
          }
        );
        setUsageData([]);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (isOpen) {
      fetchMachineDetail();
    }
  }, [isOpen, machine.id]);

  // 处理点赞
  const handleLike = async () => {
    setIsLiking(true);
    try {
      await likeMachine(machine.id);
      toast.success('点赞成功！', {
        autoClose: 1000,
        closeOnClick: true,
        hideProgressBar: true
      });
      // 重新获取详情以更新点赞数
      fetchMachineDetail();
    } catch (error) {
      console.error('点赞失败:', error);
      toast.error('点赞失败: ' + error.message, {
        autoClose: 1000,
        closeOnClick: true,
        hideProgressBar: true
      });
    } finally {
      setIsLiking(false);
    }
  };

  // 处理点踩
  const handleDislike = async () => {
    setIsLiking(true);
    try {
      await dislikeMachine(machine.id);
      toast.success('点踩成功！', {
        autoClose: 1000,
        closeOnClick: true,
        hideProgressBar: true
      });
      // 重新获取详情以更新点赞数
      fetchMachineDetail();
    } catch (error) {
      console.error('点踩失败:', error);
      toast.error('点踩失败: ' + error.message, {
        autoClose: 1000,
        closeOnClick: true,
        hideProgressBar: true
      });
    } finally {
      setIsLiking(false);
    }
  };

  const maxUsage = Math.max(...usageData.map(d => d.uses), 1);

  return (
    <Dialog onOpenChange={setIsOpen} >
      <DialogTrigger asChild>
        <div className="w-full h-full cursor-pointer">
          <WashingMachineCard
            machine={machine}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
            usageTotal={usageTotal}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1 pb-2">
          <DialogTitle className="text-base sm:text-lg">
            {machine.name || '未知设备'}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            ID: {machine.id} • {machine.status || '未知状态'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 sm:py-4 space-y-3 sm:space-y-6">
          {/* 机器详细信息卡片 */}
          {!isLoading && machineDetail && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-lg border border-blue-200">
              <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                {/* 机器类型 */}
                {machineDetail.type && (
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <span className="text-gray-600">类型:</span>
                    <span className="font-medium text-gray-900">{machineDetail.type}</span>
                  </div>
                )}

                {/* 点赞数 */}
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  <span className="text-gray-600">点赞:</span>
                  <span className="font-medium text-blue-700">{machineDetail.like || 0}</span>
                </div>

                {/* 预计使用时间 */}
                {machineDetail.avgUseTime > 0 && (
                  <div className="flex items-center space-x-1 sm:space-x-2 col-span-2">
                    <Timer className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                    <span className="text-gray-600 whitespace-nowrap">预计使用:</span>
                    <span className="font-medium text-gray-900">
                      {Math.floor(machineDetail.avgUseTime / 60)} 分钟
                    </span>
                  </div>
                )}

                {/* 上次使用时间 */}
                {machineDetail.lastUseTime > 0 && (
                  <div className="flex items-center space-x-1 sm:space-x-2 col-span-2">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600 flex-shrink-0" />
                    <span className="text-gray-600 whitespace-nowrap">上次使用:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(machineDetail.lastUseTime * 1000).toLocaleString('zh-CN', {
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* 赞/踩按钮 */}
              <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-blue-200">
                <Button
                  onClick={handleLike}
                  disabled={isLiking}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 h-8 sm:h-9"
                  size="sm"
                >
                  <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm">点赞</span>
                </Button>
                <Button
                  onClick={handleDislike}
                  disabled={isLiking}
                  variant="outline"
                  className="flex-1 border-blue-300 hover:bg-blue-100 h-8 sm:h-9"
                  size="sm"
                >
                  <ThumbsDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm">点踩</span>
                </Button>
              </div>
            </div>
          )}

          {/* 使用统计图表 */}
          <div>
            <div className="flex justify-between items-center mb-2 sm:mb-4">
              <h3 className="font-bold text-sm sm:text-lg">过去7天使用次数</h3>
              <div className="text-xs sm:text-sm text-gray-600">
                总计: {usageData.reduce((sum, d) => sum + d.uses, 0)}次
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-40 sm:h-48" />
            ) : (
              <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 180 : 240}>
                <BarChart
                  data={usageData}
                  margin={{
                    top: window.innerWidth < 640 ? 10 : 20,
                    right: window.innerWidth < 640 ? 10 : 30,
                    left: window.innerWidth < 640 ? 0 : 20,
                    bottom: 5
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
                    axisLine={{ stroke: '#e0e0e0' }}
                  />
                  <YAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
                    axisLine={{ stroke: '#e0e0e0' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="uses" radius={[4, 4, 0, 0]}>
                    {usageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.uses, maxUsage)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}

            {/* 使用统计信息 */}
            {!isLoading && usageData.length > 0 && (
              <div className="mt-2 sm:mt-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-600">平均每天:</span>
                    <span className="ml-1 sm:ml-2 font-medium">
                      {(usageData.reduce((sum, d) => sum + d.uses, 0) / 7).toFixed(1)}次
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">最高单天:</span>
                    <span className="ml-1 sm:ml-2 font-medium">
                      {Math.max(...usageData.map(d => d.uses))}次
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WashingMachineFramework;
