import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { AnimatePresence, motion } from 'framer-motion';  

import WashingMachineSkeleton from '@/components/custom/WashingMachineSkeleton';
import WashingMachineFramework from '@/components/custom/WashingMachineFramework';
import LaundryRoomList from '@/components/custom/LaundryRoomList';

const laundryRooms = [
  { id: 1, name: "沙河雁北洗衣房" ,shop_id: "202401041041470000069996565184"},
  { id: 2, name: "沙河雁南洗衣房" ,shop_id: "202401041044000000069996552384"},
  { id: 3, name: "海淀西土城校区" ,shop_id: "202302071714530000012067133598"},
];

const washingMachines = [ //mock data
  { id: 1, type:"洗衣机", name: "Mock北邮学10楼15层2号机", status: "空闲", emoji: "🟢", color: "bg-green-100", progressColor: "bg-green-500", remainingTime: 0 },
  { id: 2, type:"洗衣机", name: "Mock北邮学10楼15层3号机", status: "使用中", emoji: "🔵", color: "bg-blue-100", progressColor: "bg-blue-500", remainingTime: 15 },
  { id: 3, type:"洗衣机", name: "Mock北邮学10楼15层4号机", status: "维修中", emoji: "🔴", color: "bg-red-100", progressColor: "bg-red-500", remainingTime: 0 },
  { id: 4, type:"洗衣机", name: "Mock北邮学9楼15层2号机", status: "空闲", emoji: "🟢", color: "bg-green-100", progressColor: "bg-green-500", remainingTime: 0 }
];

const deviceCodeInfo = {
  status: ["空闲", "离线", "使用中"], // 0, 1, 2
  emoji: ["🟢", "🔴", "🔵"],
  color: ["bg-green-100", "bg-red-100", "bg-blue-100"],
  progressColor: ["bg-green-500", "bg-red-500", "bg-blue-500"]
};


const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLaundryRoom, setSelectedLaundryRoom] = useState(() => {
    const saved = localStorage.getItem('selectedLaundryRoom');
    const initialValue = JSON.parse(saved);
    return initialValue || laundryRooms[0]; // 如果没有保存的选择，就使用默认的选择
  });
  const [LaundryMachines, setLaundryMachines] = useState([]); //选中的机器
  
  useEffect(() => {
    if (selectedLaundryRoom) {
      localStorage.setItem('selectedLaundryRoom', JSON.stringify(selectedLaundryRoom));
      setIsLoading(true);
      fetch(`http://localhost:8000/api/v1/getLaundryMachines?LaundryID=${selectedLaundryRoom.shop_id}`)
        .then(response => response.json())
        .then(data => {
          const machines = data["洗衣机"];
          const formattedMachines = Object.keys(machines).map((key) => {
            const machine = machines[key];
            return {
              id: key,
              type: "洗衣机",
              name: machine.name,
              status: deviceCodeInfo.status[machine.deviceCode],
              emoji: deviceCodeInfo.emoji[machine.deviceCode],
              color: deviceCodeInfo.color[machine.deviceCode],
              progressColor: deviceCodeInfo.progressColor[machine.deviceCode],
              remainingTime: machine.remainTime,
            };
          });  
  
          setLaundryMachines(formattedMachines);  
          setIsLoading(false);
        })
        .catch(error => {
          console.error('API Error:', error);
          toast.error(
            '获取洗衣房信息失败\n ' + error ,
            {
                autoClose: 2000,
                closeOnClick: true,
                hideProgressBar: true
            }
          );
          setLaundryMachines(washingMachines);
          setIsLoading(false);
        });
    }
  }, [selectedLaundryRoom]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{selectedLaundryRoom.name}</h1>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top">
              <SheetTitle />
              <SheetDescription />
              <LaundryRoomList laundryRooms={laundryRooms} selectedLaundryRoom={selectedLaundryRoom} setSelectedLaundryRoom={setSelectedLaundryRoom} />
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:block w-64 bg-white shadow-md">
          <LaundryRoomList laundryRooms={laundryRooms} selectedLaundryRoom={selectedLaundryRoom} setSelectedLaundryRoom={setSelectedLaundryRoom} />
        </aside>
        <main className="flex-1 p-4 md:p-8 overflow-auto">
        <ToastContainer />

        <AnimatePresence mode="wait">  
            <motion.div  
              key={isLoading ? 'loading' : 'content'}  
              initial={{ opacity: 0 }}  
              animate={{ opacity: 1 }}  
              exit={{ opacity: 0 }}  
              transition={{ duration: 0.3 }}  
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"  
            >
              {isLoading ? (
                <WashingMachineSkeleton count={10} /> 
              ) : (
                LaundryMachines.map((machine) => (
                  <WashingMachineFramework key={machine.id} machine={machine} />
                ))
              )}
            </motion.div>
          </AnimatePresence>  
        </main>
      </div>
    </div>
  );
};

export default Index;