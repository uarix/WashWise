import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { toast } from 'react-toastify';
import { Skeleton } from "@/components/ui/skeleton";
import WashingMachineCard from '@/components/custom/WashingMachineCard';
import { API_ENDPOINTS } from '@/config/api';

const WashingMachineFramework = ({
  machine,
  isFavorite,
  onToggleFavorite,
  usageTotal = 0
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [usageData, setUsageData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetch(API_ENDPOINTS.getMachineDetail(machine.id))
        .then(async response => {
          if (!response.ok) {
            const res = await response.json();
            throw new Error(`${res["detail"]}`);
          }
          return response.json();
        })
        .then(data => {
          setUsageData(transformData(data));
          setIsLoading(false);
        })
        .catch(error => {
          console.error('getMachineDetail API Error: ', error);
          toast.error(
            '获取洗衣机详细信息失败 ' + error,
            {
              autoClose: 1000,
              closeOnClick: true,
              hideProgressBar: true
            }
          );
          setIsLoading(true);
        });
    }
  }, [isOpen, machine.id]);

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {machine.name || '未知设备'}
          </DialogTitle>
          <DialogDescription>
            ID: {machine.id} • {machine.status || '未知状态'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">过去7天使用次数</h3>
            <div className="text-sm text-gray-600">
              总计: {usageData.reduce((sum, d) => sum + d.uses, 0)}次
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-48" />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={usageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
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
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">平均每天:</span>
                  <span className="ml-2 font-medium">
                    {(usageData.reduce((sum, d) => sum + d.uses, 0) / 7).toFixed(1)}次
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">最高单天:</span>
                  <span className="ml-2 font-medium">
                    {Math.max(...usageData.map(d => d.uses))}次
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WashingMachineFramework;
