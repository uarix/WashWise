
import requests
import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

def check_id(session, goods_id):
    url = "https://userapi.qiekj.com/goods/normal/details"
    headers = {
        "accept": "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "content-type": "multipart/form-data; boundary=----WebKitFormBoundarykZvHVUctUtOUwFD2",
        "phonebrand": "DEFAULT",
        "sec-ch-ua": '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "uid": "undefined",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    }
    data = f'------WebKitFormBoundarykZvHVUctUtOUwFD2\r\nContent-Disposition: form-data; name="goodsId"\r\n\r\n{goods_id}\r\n------WebKitFormBoundarykZvHVUctUtOUwFD2--\r\n'
    
    try:
        response = session.post(url, headers=headers, data=data)
        response.raise_for_status()
        result = response.json()
        if result['code'] == 0 :
            return result
    except requests.exceptions.RequestException as e:
        print(f"Error checking ID {goods_id}: {str(e)}")
    return None

def main():
    range_ids = range(1100812842-200, 1100813068+200)
    matching_ids = []

    with requests.Session() as session:
        with ThreadPoolExecutor(max_workers=5) as executor:
            future_to_id = {executor.submit(check_id, session, id): id for id in range_ids}
            for future in as_completed(future_to_id):
                result = future.result()
                if result:
                    if "北京邮电大学" in result['data']['brandName']:
                        matching_ids.append(result['data']['goodsId'])
                        print(f"Found matching ID: {result['data']['goodsId']}")
                        print("brandName: ", result['data']['brandName'])
                time.sleep(0.01)  # Add a delay between requests

    print("All matching IDs:", sorted(matching_ids))

if __name__ == "__main__":
    main()
