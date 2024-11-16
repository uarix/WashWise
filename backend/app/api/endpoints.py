from fastapi import APIRouter, HTTPException, Query

from app.core.data_store import (
    get_laundry_machines_data, 
    get_laundry_shops_data
)
from app.schemas.laundry import Machine, Laundry
from app.core.usage_tracker import usage_tracker

router = APIRouter()


# /api/v1/getLaundryMachines?LaundryID=1
@router.get("/api/v1/getLaundryMachines")
async def get_laundry_room(LaundryID: str = Query(None)):
    """
    Get laundry room data for a given LaundryID.
    """
    data = get_laundry_shops_data(LaundryID)
    
    if not data:
        raise HTTPException(status_code=404, detail="Laundry room not found")
    
    # Prepare the response structure
    response = {}
    
    for machine_type_name, machine_ids in data.items():
        response[machine_type_name] = {}
        
        for machine_id in machine_ids:
            machine_details = get_laundry_machines_data(machine_id)
            if machine_details is not None:
                response[machine_type_name][machine_id] = machine_details
            else:
                print(f"Details not found for machine ID: {machine_id}")
    
    return response


# /api/v1/getMachineDetail?MachineID=1
@router.get("/api/v1/getMachineDetail")
async def get_laundry_machine_usage(MachineID: int = Query(None)):
    """
    Get usage data for a specific machine over the last 7 days.
    """
    usage_data = usage_tracker.get_usage_last_7_days(MachineID)
    
    if not usage_data:
        raise HTTPException(
            status_code=404, 
            detail="Laundry machine not found or no usage data available"
        )
    
    return usage_data
