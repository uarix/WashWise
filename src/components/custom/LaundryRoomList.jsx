import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Star, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const LaundryRoomList = ({ 
  laundryRooms, 
  selectedLaundryRoom, 
  setSelectedLaundryRoom,
  favoriteMachines = [],
  machines = [],
  onMachineClick,
  onToggleFavorite
}) => (
    <ScrollArea className="h-full">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">洗衣房</h2>
        {laundryRooms.map((room) => (
          <Button
            key={room.id}
            variant={selectedLaundryRoom.id === room.id ? "default" : "ghost"}
            className="w-full justify-start mb-2"
            onClick={() => setSelectedLaundryRoom(room)}
          >
            {room.name}
          </Button>
        ))}
        
        {/* 收藏机器快捷访问 */}
        {favoriteMachines.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Star className="h-4 w-4 mr-2 text-yellow-500" />
                收藏机器
              </h3>
              {favoriteMachines.map((machineId) => {
                const machine = machines.find(m => m.id === machineId);
                if (!machine) return null;
                return (
                  <div key={machineId} className="flex items-center group mb-1">
                    <Button
                      variant="ghost"
                      className="flex-1 justify-start text-sm h-8 pr-1"
                      onClick={() => onMachineClick && onMachineClick(machine)}
                    >
                      <span className={`w-2 h-2 rounded-full mr-2 ${machine.progressColor}`}></span>
                      <span className="truncate">
                        {machine.name.length > 15 ? machine.name.substring(0, 15) + '...' : machine.name}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite && onToggleFavorite(machineId);
                      }}
                    >
                      <X className="h-3 w-3 text-gray-400 hover:text-red-500" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </>
        )}


      </div>
    </ScrollArea>
  );

export default LaundryRoomList;