import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { toast } from 'react-toastify';
import { Skeleton } from "@/components/ui/skeleton"; 
import WashingMachineCard from '@/components/custom/WashingMachineCard';


// const mock_usageData = [
//     { day: "26", uses: 20 },
//     { day: "28", uses: 15 },
//     { day: "29", uses: 25 },
//     { day: "31", uses: 22 },
//     { day: "1", uses: 30 },
//     { day: "2", uses: 28 },
//     { day: "3", uses: 10 },
//   ];

const WashingMachineFramework = ({ machine }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [usageData, setUsageData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const transformData = (data) => {
        return Object.entries(data).map(([key, value]) => {
            return { day: key.slice(-2) + "号", uses: value };
        });
    };

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            fetch(`http://localhost:8000/api/v1/getMachineDetail?MachineID=${machine.id}`)
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
                '获取洗衣机详细信息失败 ' + error ,
                {
                    autoClose: 1000,
                    closeOnClick: true,
                    hideProgressBar: true
                }
              );
              //setUsageData(mock_usageData);
              setIsLoading(true);
            });
        }
      }, [isOpen, machine.id]);
    
    return (
    <Dialog onOpenChange={setIsOpen} >
      <DialogTrigger asChild>
        <div className="w-full h-full cursor-pointer">
          <WashingMachineCard machine={machine} />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {`洗衣机 #${machine.id} 详情`}
          </DialogTitle>
          <DialogDescription>
            {machine.status}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <h3 className="mb-2 font-bold">过去7天使用次数</h3>
          {isLoading ? (
            <Skeleton className="h-40" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day"/>
                <YAxis type="number" allowDecimals={false}/>
                <Tooltip />
                <Bar dataKey="uses" fill="#669999" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WashingMachineFramework;