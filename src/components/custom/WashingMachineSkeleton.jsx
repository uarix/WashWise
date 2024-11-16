import { Skeleton } from "@/components/ui/skeleton"; 

const WashingMachineSkeleton = ({ count = 15 }) => {  
    return (
        <> 
        {Array(count).fill().map((_, index) => (
                  <div key={index} className="p-4 rounded-md bg-gray-200">
                    <div className="flex items-center mb-2">  
                      <Skeleton className="w-6 h-6 rounded-full mr-3" /> {/* Emoji placeholder */}  
                      <Skeleton className="h-6 w-24" /> {/* Machine name placeholder */}  
                    </div>  
                    <div className="mt-auto">  
                      <div className="flex items-center justify-between mt-4">  
                        <Skeleton className="h-3 w-16" /> {/* Status placeholder */}  
                        <Skeleton className="h-3 w-10" /> {/* Time placeholder */}  
                      </div>  
                      <Skeleton className="h-4 w-full rounded-full mt-2" /> {/* Progress bar placeholder */}  
                    </div>
                  </div>
                ))
        }
        </>  
        );  
    };  

    export default WashingMachineSkeleton;  