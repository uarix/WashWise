import asyncio
import json
import aiohttp
from loguru import logger

from app.config import FETCH_INTERVAL
from app.core.data_store import (
    update_laundry_shops_data, 
    get_laundry_shops_data, 
    update_laundry_machines_data, 
    get_laundry_machines_data
)
from app.core.usage_tracker import usage_tracker

headers = {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9",
    "channel": "wechat",
    "content-type": "application/x-www-form-urlencoded",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "uid": "undefined",
    "xweb_xhr": "1",
    "User-Agent": (
        "BUPTGateWay Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    )
}


async def fetch_machine_types(shop_id):
    """
    Fetch machine types for a specific shop.
    """
    async with aiohttp.ClientSession() as session:
        body = f"shopId={shop_id}"
        async with session.post(
            "https://userapi.qiekj.com/machineModel/nearByList", 
            headers=headers, 
            data=body
        ) as response:
            if response.status == 200:
                data = await response.json()
                if data['code'] == 0 and 'data' in data and 'items' in data['data']:
                    return data['data']['items']
            logger.error(f"Failed to fetch machine types for shop {shop_id}: HTTP {response.status}")
    return []


async def fetch_machines(shop_id, machine_type_id):
    """
    Fetch machines of a given type from a specific shop.
    """
    async with aiohttp.ClientSession() as session:
        body = f"shopId={shop_id}&machineTypeId={machine_type_id}&pageSize=1000&page=1"
        async with session.post(
            "https://userapi.qiekj.com/machineModel/near/machines", 
            headers=headers, 
            data=body
        ) as response:
            if response.status == 200:
                data = await response.json()
                if data['code'] == 0 and 'data' in data and 'items' in data['data']:
                    return data['data']['items']
            logger.error(f"Failed to fetch machines for shop {shop_id} and type {machine_type_id}: HTTP {response.status}")
    return []


async def fetch_machine_usage(machine_id):
    """
    Fetch usage data for a specific machine.
    """
    async with aiohttp.ClientSession() as session:
        body = f"goodsId={machine_id}"
        async with session.post(
            "https://userapi.qiekj.com/goods/normal/details", 
            headers=headers, 
            data=body
        ) as response:
            if response.status == 200:
                data = await response.json()
                if data['code'] == 0 and 'data' in data:
                    machine_data = data['data']
                    usage_data = {
                        "name": machine_data['name'],
                        "deviceCode": machine_data['deviceErrorCode'] or 0,
                        "deviceMsg": machine_data['deviceErrorMsg'] or 'Idle',
                    }
                    return usage_data
            logger.error(f"Failed to fetch usage data for machine {machine_id}: HTTP {response.status}")
    return None


async def update_laundry_data():
    """
    Update laundry data for a set of shops.
    """
    shops = [
        "202401041041470000069996565184",
        "202401041044000000069996552384",
        "202302071714530000012067133598"
    ]
    
    for shop_id in shops:
        laundry_data = {}
        laundry_data_before = get_laundry_shops_data(shop_id)
        machine_types = await fetch_machine_types(shop_id)
        
        for machine_type in machine_types:
            machine_type_id = machine_type['machineTypeId']
            machine_type_name = machine_type['machineTypeName']
            machines = await fetch_machines(shop_id, machine_type_id)
            new_machine_ids = set(machine['id'] for machine in machines)
            
            if machine_type_name in laundry_data_before:
                existing_machine_ids = set(laundry_data_before[machine_type_name])
                updated_machine_ids = existing_machine_ids.union(new_machine_ids)
                laundry_data[machine_type_name] = sorted(list(updated_machine_ids), key=int)
            else:
                laundry_data[machine_type_name] = sorted(list(new_machine_ids), key=int)
            
            for machine in machines:
                machine_id = machine['id']
                usage_data = await fetch_machine_usage(machine_id)
                
                if usage_data:
                    last_machine_data = get_laundry_machines_data(machine_id)
                    
                    remain_time = 0
                    errorCount = 0
                    
                    if last_machine_data:
                        # Debug print for specific machine ID
                        # if machine_id == "1100554530":
                        #     print(f"Machine ID: {machine_id}")
                        #     print(f"Last Machine Data: {last_machine_data}")
                        #     print(f"Current Usage Data: {usage_data}")
                        
                        errorCount = last_machine_data.get('errorCount', 0)
                        if last_machine_data['deviceCode'] == 0 and usage_data["deviceCode"] == 2:
                            remain_time = 30 * 60  # 30 minutes
                            usage_tracker.record_usage(machine_id)
                        elif last_machine_data['deviceCode'] == 2 and usage_data["deviceCode"] == 2:
                            remain_time = max(0, last_machine_data['remainTime'] - FETCH_INTERVAL)
                        elif last_machine_data['deviceCode'] == 2 and usage_data["deviceCode"] == 0:
                            remain_time = 0
                        elif usage_data["deviceCode"] == 4204:
                            errorCount += 1
                            if errorCount >= 6:
                                remain_time = 0
                        else:
                            errorCount = 0
                    
                    usage_data['remainTime'] = remain_time
                    usage_data['errorCount'] = errorCount
                    update_laundry_machines_data(machine_id, usage_data)
        
        update_laundry_shops_data(shop_id, laundry_data)
    
    return laundry_data


async def start_data_fetcher():
    """
    Start the periodic data fetcher with exception handling.
    """
    while True:
        try:
            await update_laundry_data()
        except Exception as e:
            logger.error(f"Error in data fetcher: {str(e)}")
        await asyncio.sleep(FETCH_INTERVAL)
