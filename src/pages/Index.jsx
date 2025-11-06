import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ArrowUpDown, Star, Search } from "lucide-react";
import { AnimatePresence, motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import WashingMachineSkeleton from '@/components/custom/WashingMachineSkeleton';
import WashingMachineFramework from '@/components/custom/WashingMachineFramework';
import LaundryRoomList from '@/components/custom/LaundryRoomList';
import { API_ENDPOINTS } from '@/config/api';

const laundryRooms = [
  { id: 1, name: "沙河雁北洗衣房", shop_id: "202401041041470000069996565184" },
  { id: 2, name: "沙河雁南洗衣房", shop_id: "202401041044000000069996552384" },
  { id: 3, name: "海淀西土城校区", shop_id: "202302071714530000012067133598" },
];

const washingMachines = [ //mock data
  { id: 1, type: "洗衣机", name: "Mock北邮学10楼15层2号机", status: "空闲", color: "bg-green-100", progressColor: "bg-green-500", remainingTime: 0 },
  { id: 2, type: "洗衣机", name: "Mock北邮学10楼15层3号机", status: "使用中", color: "bg-blue-100", progressColor: "bg-blue-500", remainingTime: 15 },
  { id: 3, type: "洗衣机", name: "Mock北邮学10楼15层4号机", status: "维修中", color: "bg-red-100", progressColor: "bg-red-500", remainingTime: 0 },
  { id: 4, type: "洗衣机", name: "Mock北邮学9楼15层2号机", status: "空闲", color: "bg-green-100", progressColor: "bg-green-500", remainingTime: 0 }
];

const deviceCodeInfo = {
  status: ["空闲", "离线", "使用中"], // 0, 1, 2
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
  const [sortBy, setSortBy] = useState('name'); // 'name', 'time', 'usage'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [searchTerm, setSearchTerm] = useState(''); // 搜索关键词

  const [favoriteMachines, setFavoriteMachines] = useState(() => {
    const saved = localStorage.getItem('favoriteMachines');
    return saved ? JSON.parse(saved) : [];
  });
  const [machineUsageData, setMachineUsageData] = useState({}); // 存储每台机器的使用数据



  // 保存收藏机器到本地存储
  useEffect(() => {
    localStorage.setItem('favoriteMachines', JSON.stringify(favoriteMachines));
  }, [favoriteMachines]);



  // 切换收藏状态
  const toggleFavorite = (machineId) => {
    setFavoriteMachines(prev =>
      prev.includes(machineId)
        ? prev.filter(id => id !== machineId)
        : [...prev, machineId]
    );
  };

  // 获取机器的7天使用总数
  const getMachineUsageTotal = (machineId) => {
    const data = machineUsageData[machineId];
    if (!data) return 0;
    return Object.values(data).reduce((sum, count) => sum + count, 0);
  };

  // 过滤和排序机器
  const filterAndSortMachines = (machines) => {
    // 先过滤搜索结果
    let filtered = machines;
    if (searchTerm.trim()) {
      filtered = machines.filter(machine =>
        (machine.name && machine.name.includes(searchTerm)) ||
        (machine.status && machine.status.includes(searchTerm))
      );
    }

    // 再排序
    const sorted = [...filtered].sort((a, b) => {
      // 确保数据存在
      if (!a || !b) return 0;

      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'time':
          // 空闲机器排最前面，然后按剩余时间从少到多排序
          const aStatus = a.status || '';
          const bStatus = b.status || '';

          if (aStatus === '空闲' && bStatus !== '空闲') {
            comparison = -1;
          } else if (aStatus !== '空闲' && bStatus === '空闲') {
            comparison = 1;
          } else if (aStatus === '空闲' && bStatus === '空闲') {
            comparison = 0;
          } else {
            // 都不是空闲状态，按剩余时间排序
            comparison = (a.remainingTime || 0) - (b.remainingTime || 0);
          }
          break;
        case 'usage':
          comparison = getMachineUsageTotal(a.id) - getMachineUsageTotal(b.id);
          break;
        default:
          return 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  };

  useEffect(() => {
    if (selectedLaundryRoom) {
      localStorage.setItem('selectedLaundryRoom', JSON.stringify(selectedLaundryRoom));
      setIsLoading(true);
      fetch(API_ENDPOINTS.getLaundryMachines(selectedLaundryRoom.shop_id))
        .then(response => response.json())
        .then(data => {
          const machines = data["洗衣机"];
          const formattedMachines = Object.keys(machines).map((key) => {
            const machine = machines[key];
            // 处理未知状态，将其视为离线
            const deviceCode = machine.deviceCode;
            const isValidCode = deviceCode >= 0 && deviceCode < deviceCodeInfo.status.length;

            return {
              id: key,
              type: "洗衣机",
              name: machine.name,
              status: isValidCode ? deviceCodeInfo.status[deviceCode] : "离线",
              color: isValidCode ? deviceCodeInfo.color[deviceCode] : "bg-red-100",
              progressColor: isValidCode ? deviceCodeInfo.progressColor[deviceCode] : "bg-red-500",
              remainingTime: machine.remainTime || 0,
            };
          });

          setLaundryMachines(formattedMachines);

          // 获取所有机器的使用数据
          const usagePromises = formattedMachines.map(machine =>
            fetch(API_ENDPOINTS.getMachineDetail(machine.id))
              .then(response => response.ok ? response.json() : {})
              .then(usageData => ({ id: machine.id, data: usageData }))
              .catch(() => ({ id: machine.id, data: {} }))
          );

          Promise.all(usagePromises).then(results => {
            const usageMap = {};
            results.forEach(result => {
              usageMap[result.id] = result.data;
            });
            setMachineUsageData(usageMap);
          });

          setIsLoading(false);
        })
        .catch(error => {
          console.error('API Error:', error);
          toast.error(
            '获取洗衣房信息失败\n ' + error,
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
      <header className="bg-white shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
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
                <LaundryRoomList
                  laundryRooms={laundryRooms}
                  selectedLaundryRoom={selectedLaundryRoom}
                  setSelectedLaundryRoom={setSelectedLaundryRoom}
                  favoriteMachines={favoriteMachines}
                  machines={LaundryMachines}
                  onToggleFavorite={toggleFavorite}
                  onMachineClick={(machine) => {
                    // 滚动到对应机器
                    const element = document.getElementById(`machine-${machine.id}`);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      element.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50');
                      setTimeout(() => {
                        element.classList.remove('ring-2', 'ring-blue-500', 'ring-opacity-50');
                      }, 2000);
                    }
                  }}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* 控制面板 */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* 搜索框 */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索洗衣机名称或状态..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 排序选择 */}
          <div className="flex items-center space-x-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">按名称</SelectItem>
                <SelectItem value="time">按等待时间</SelectItem>
                <SelectItem value="usage">按使用次数</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <ArrowUpDown className="h-4 w-4 mr-1" />
              {sortOrder === 'asc' ? '升序' : '降序'}
            </Button>
          </div>

          {/* 收藏统计 */}
          {favoriteMachines.length > 0 && (
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-gray-600">收藏: {favoriteMachines.length}</span>
            </div>
          )}
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:block w-64 bg-white shadow-md">
          <LaundryRoomList
            laundryRooms={laundryRooms}
            selectedLaundryRoom={selectedLaundryRoom}
            setSelectedLaundryRoom={setSelectedLaundryRoom}
            favoriteMachines={favoriteMachines}
            machines={LaundryMachines}
            onToggleFavorite={toggleFavorite}
            onMachineClick={(machine) => {
              // 滚动到对应机器
              const element = document.getElementById(`machine-${machine.id}`);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50');
                setTimeout(() => {
                  element.classList.remove('ring-2', 'ring-blue-500', 'ring-opacity-50');
                }, 2000);
              }
            }}
          />
        </aside>
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <ToastContainer />

          {/* 统计面板 */}
          {!isLoading && LaundryMachines.length > 0 && (
            <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">
                  {LaundryMachines.filter(m => m.status === '空闲').length}
                </div>
                <div className="text-sm text-green-600">空闲机器</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">
                  {LaundryMachines.filter(m => m.status === '使用中').length}
                </div>
                <div className="text-sm text-blue-600">使用中</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-700">
                  {LaundryMachines.filter(m => m.status === '维修中' || m.status === '离线').length}
                </div>
                <div className="text-sm text-red-600">故障/离线</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-700">
                  {favoriteMachines.length}
                </div>
                <div className="text-sm text-yellow-600">收藏机器</div>
              </div>
            </div>
          )}

          {/* 搜索结果提示 */}
          {!isLoading && searchTerm.trim() && LaundryMachines.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                搜索 "{searchTerm}" 找到 {filterAndSortMachines(LaundryMachines).length} 台洗衣机
              </p>
            </div>
          )}

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
              ) : (LaundryMachines.length === 0 || filterAndSortMachines(LaundryMachines).length === 0) ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {searchTerm.trim() ? '没有找到匹配的洗衣机' : '暂无洗衣机数据'}
                  </p>
                </div>
              ) : (
                filterAndSortMachines(LaundryMachines).map((machine) => (
                  <div key={machine.id} id={`machine-${machine.id}`} className="transition-all duration-300">
                    <WashingMachineFramework
                      machine={machine}
                      isFavorite={favoriteMachines.includes(machine.id)}
                      onToggleFavorite={toggleFavorite}
                      usageTotal={getMachineUsageTotal(machine.id)}
                    />
                  </div>
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
