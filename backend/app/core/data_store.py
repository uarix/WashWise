from loguru import logger
from typing import Dict, Any

# In-memory data store for laundry machines and shops
laundry_machines_data: Dict[str, Any] = {}
laundry_shops_data: Dict[str, Any] = {}


def update_laundry_machines_data(machine_id: str, data: Any):
    """
    Store data for a specific laundry machine.
    
    Machine data structure:
    {
        "machine_id": {
            "name": str,
            "deviceErrorCode": int,
            "deviceErrorMsg": str,
            "remainTime": int,
            "errorCount": int
        },
        ...
    }
    """
    laundry_machines_data[machine_id] = data
    logger.debug(f"Updated data for machine {machine_id}")


def get_laundry_machines_data(machine_id: str) -> Any:
    """
    Retrieve data for a specific laundry machine.
    Returns an empty dictionary if no data is found.
    """
    return laundry_machines_data.get(machine_id, {})


def update_laundry_shops_data(shop_id: str, data: Any):
    """
    Store data for a specific laundry shop.
    
    Shop data structure:
    {
        "shop_id": {
            "MachineType": ["MachineID", ...],
            ...
        },
        ...
    }
    """
    laundry_shops_data[shop_id] = data
    logger.debug(f"Updated data for shop {shop_id}")


def get_laundry_shops_data(shop_id: str) -> Any:
    """
    Retrieve data for a specific laundry shop.
    Returns an empty dictionary if no data is found.
    """
    return laundry_shops_data.get(shop_id, {})
