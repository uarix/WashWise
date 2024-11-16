import aiohttp  
import asyncio  

headers = {  
    "accept": "*/*",  
    "accept-language": "zh-CN,zh;q=0.9",  
    "channel": "wechat",  
    "content-type": "application/x-www-form-urlencoded",  
    "sec-fetch-dest": "empty",  
    "sec-fetch-mode": "cors",  
    "sec-fetch-site": "cross-site",  
    "uid": "undefined",  
    "xweb_xhr": "1"  ,
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"

}  
async def fetch_machine_types(shop_id):  
    async with aiohttp.ClientSession() as session:  
        body = f"shopId={shop_id}"  
        async with session.post("https://userapi.qiekj.com/machineModel/nearByList", headers=headers, data=body) as response:  
            print(await response.text())  
            if response.status == 200:  
                data = await response.json()  
                print(data)  
                if data.get('code') == 0 and 'data' in data and 'items' in data['data']:  
                    return data['data']['items']  
            print(f"Failed to fetch machine types for shop {shop_id}: HTTP {response.status}")  
    return []  

# Test the function  
shop_id = "202401041041470000069996565184"  
asyncio.run(fetch_machine_types(shop_id))  