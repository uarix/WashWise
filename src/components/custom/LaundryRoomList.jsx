import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const LaundryRoomList = ({ laundryRooms, selectedLaundryRoom, setSelectedLaundryRoom }) => (
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
      </div>
    </ScrollArea>
  );

export default LaundryRoomList;