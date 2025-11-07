import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, StarOff } from "lucide-react";

const WashingMachineCard = ({
  machine,
  isFavorite,
  onToggleFavorite,
  usageTotal = 0
}) => {
  const getProgressValue = () => {
    if (machine.status === "空闲") return 100;
    if (machine.status === "维修中" || machine.status === "离线" || machine.status === "未知状态" || !machine.status) return 0;
    return (machine.remainingTime / (60 * 60) * 100);
  };

  return (
    <Card key={machine.id} className={`${machine.color || 'bg-gray-100'} h-full relative group ${isFavorite ? 'ring-2 ring-yellow-300' : ''}`}>
      <CardContent className="p-4 flex flex-col justify-between h-full">
        {/* 机器名称、收藏indicator和收藏按钮在同一行 */}
        <div className="flex items-center justify-between mb-2 mt-2">
          <div className="flex items-center flex-1 min-w-0">
            <span className={`w-6 h-6 shrink-0 mr-2 rounded-full ${machine.progressColor || 'bg-gray-500'}`}></span>
            <div className="font-bold text-sm truncate">{machine.name || '未知设备'}</div>
          </div>

          {/* 收藏indicator和收藏按钮 */}
          <div className="flex items-center space-x-2 ml-2">
            {/* 收藏标识 */}
            {isFavorite && (
              <div className="bg-yellow-100 text-yellow-600 px-1.5 py-0.5 rounded-full text-xs flex items-center">
                <Star className="h-2.5 w-2.5 mr-0.5 fill-current" />
                收藏
              </div>
            )}

            {/* 收藏按钮 - 桌面端悬停显示，移动端始终显示 */}
            <div className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(machine.id);
                }}
                className="h-6 w-6 p-0 bg-white/80 hover:bg-white touch-manipulation"
              >
                {isFavorite ? <Star className="h-3 w-3 text-yellow-500 fill-current" /> : <StarOff className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </div>

        {/* 显示7天使用次数 */}
        <div className="text-xs text-gray-600 mb-2">
          7天使用: {usageTotal}次
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm">{machine.status || '未知状态'}</span>
            {machine.remainingTime > 0 && (
              <span className="text-xs">{`预计剩余 ${Math.ceil(machine.remainingTime / 60)} 分钟`}</span>
            )}
          </div>
          <Progress
            value={getProgressValue()}
            className="w-full"
            indicatorClassName={machine.progressColor || 'bg-gray-500'}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default WashingMachineCard;
