import { Skeleton } from "@/components/ui/skeleton"; 
import { Card, CardContent } from "@/components/ui/card";

const WashingMachineSkeleton = ({ count = 15 }) => {  
    return (
        <> 
        {Array(count).fill().map((_, index) => (
          <Card key={index} className="h-full bg-gray-50">
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-2 mt-2">
                <div className="flex items-center flex-1 min-w-0">
                  <Skeleton className="w-6 h-6 rounded-full mr-2" /> {/* Status indicator placeholder */}
                  <Skeleton className="h-4 w-24" /> {/* Machine name placeholder */}
                </div>
                <div className="flex items-center space-x-2 ml-2">
                  <Skeleton className="h-4 w-12 rounded-full" /> {/* Favorite indicator placeholder */}
                  <Skeleton className="h-6 w-6 rounded" /> {/* Favorite button placeholder */}
                </div>
              </div>
              
              {/* 7天使用次数占位 */}
              <div className="mb-2">
                <Skeleton className="h-3 w-16" />
              </div>
              
              <div className="mt-auto">
                <div className="flex items-center justify-between mb-1">
                  <Skeleton className="h-4 w-12" /> {/* Status placeholder */}
                  <Skeleton className="h-3 w-10" /> {/* Time placeholder */}
                </div>
                <Skeleton className="h-2 w-full rounded-full" /> {/* Progress bar placeholder */}
              </div>
            </CardContent>
          </Card>
        ))}
        </>  
    );  
    };  

    export default WashingMachineSkeleton;  