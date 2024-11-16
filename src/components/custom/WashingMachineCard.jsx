import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

const WashingMachineCard = ({ machine }) => {
    const getProgressValue = () => {
      if (machine.status === "空闲") return 100;
      if (machine.status === "维修中") return 0;
      return (machine.remainingTime / (30 * 60) * 100);
    };
  
    return (
      <Card key={machine.id} className={`${machine.color} h-full`}>
        <CardContent className="p-4 flex flex-col justify-between h-full">
          <div className="flex items-center mb-2">
            <span className={`w-6 h-6 shrink-0 mr-2 rounded-full ${machine.progressColor}`}></span>
            <div className="font-bold">{`${machine.name}`}</div>
          </div>
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-1">
              <span>{machine.status}</span>
              {machine.remainingTime > 0 && (
                <span className="text-sm">{`${Math.ceil(machine.remainingTime / 60)} 分钟`}</span>
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