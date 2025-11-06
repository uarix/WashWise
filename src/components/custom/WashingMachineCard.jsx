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
      if (machine.status === "维修中") return 0;
      return (machine.remainingTime / (30 * 60) * 100);
    };
  
    return (
      <Card key={machine.id} className={`${machine.color} h-full relative group ${isFavorite ? 'ring-2 ring-yellow-300' : ''}`}>
        <CardContent className="p-4 flex flex-col justify-between h-full">
          {/* 收藏标识 - 始终显示 */}
          <div className="absolute top-2 left-2 flex space-x-1">
            {isFavorite && (
              <div className="bg-yellow-100 text-yellow-600 px-1.5 py-0.5 rounded-full text-xs flex items-center">
                <Star className="h-2.5 w-2.5 mr-0.5 fill-current" />
                收藏
              </div>
            )}
          </div>

          {/* 收藏按钮 - 悬停时显示 */}
          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(machine.id);
              }}
              className="h-6 w-6 p-0 bg-white/80 hover:bg-white"
            >
              {isFavorite ? <Star className="h-3 w-3 text-yellow-500 fill-current" /> : <StarOff className="h-3 w-3" />}
            </Button>
          </div>

          <div className="flex items-center mb-2 mt-4">
            <span className={`w-6 h-6 shrink-0 mr-2 rounded-full ${machine.progressColor}`}></span>
            <div className="font-bold text-sm pr-8">{`${machine.name}`}</div>
          </div>
          
          {/* 显示7天使用次数 */}
          <div className="text-xs text-gray-600 mb-2">
            7天使用: {usageTotal}次
          </div>
          
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">{machine.status}</span>
              {machine.remainingTime > 0 && (
                <span className="text-xs">{`${Math.ceil(machine.remainingTime / 60)} 分钟`}</span>
              )}
            </div>
            <Progress 
              value={getProgressValue()} 
              className="w-full"
              indicatorClassName={machine.progressColor}
            />
          </div>
        </CardContent>
      </Card>
    );
  };

export default WashingMachineCard;