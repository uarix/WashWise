/*
deviceErrorCode: 4204
deviceErrorMsg: "设备离线，提示文案“设备离线，请检查设备是否通电（若刚通电需要等待约3分钟设备才可联网完成）故障码【4204】

deviceErrorCode: null
deviceErrorMsg: null

deviceErrorCode: 2
deviceErrorMsg: "设备工作中，请更换设备使用"

fetch("https://userapi.qiekj.com/machineModel/nearByList", {
  "headers": {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9",
    "channel": "wechat",
    "content-type": "application/x-www-form-urlencoded",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "uid": "114514",
    "xweb_xhr": "1"
  },
  "referrer": "https://servicewechat.com/******/84/page-frame.html",
  "referrerPolicy": "unsafe-url",
  "body": "shopId=202401041041470000069996565184",
  "method": "POST",
  "mode": "cors",
  "credentials": "omit"
});

{"code":0,"msg":"成功","data":{"items":[{"machineTypeId":"c9892cb4-bd78-40f6-83c2-ba73383b090a","machineTypeName":"洗衣机","parentTypeId":7,"idleCount":37,"workingCount":19,"shopState":2,"openTime":"00:00-24:00"}]},"t":17xxxxxxx}

fetch("https://userapi.qiekj.com/machineModel/near/machines", {
  "headers": {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9",
    "channel": "wechat",
    "content-type": "application/x-www-form-urlencoded",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "uid": "xxxxxxx",
    "xweb_xhr": "1"
  },
  "referrer": "https://servicewechat.com/xxxxxxx/84/page-frame.html",
  "referrerPolicy": "unsafe-url",
  "body": "shopId=202401041041470000069996565184&machineTypeId=c9892cb4-bd78-40f6-83c2-ba73383b090a&pageSize=1000&page=1",
  "method": "POST",
  "mode": "cors",
  "credentials": "omit"
});

{"code":0,"msg":"成功","data":{"items":[{"id":"1100812964","type":2,"name":"男25号机","status":1},{"id":"1100813013","type":2,"name":"1号机","status":1},{"id":"1100813016","type":2,"name":"4号机","status":1},{"id":"1100813017","type":2,"name":"5号机","status":1},{"id":"1100813018","type":2,"name":"6号机","status":1},{"id":"1100813020","type":2,"name":"8号机","status":1},{"id":"1100813022","type":2,"name":"10号机","status":1},{"id":"1100813023","type":2,"name":"11号机","status":1},{"id":"1100813026","type":2,"name":"14号机","status":1},{"id":"1100813027","type":2,"name":"15号机","status":1},{"id":"1100813028","type":2,"name":"16号机","status":1},{"id":"1100813029","type":2,"name":"17号机","status":1},{"id":"1100813032","type":2,"name":"20号机","status":1},{"id":"1100813033","type":2,"name":"21号机","status":1},{"id":"1100813034","type":2,"name":"22号机","status":1},{"id":"1100813035","type":2,"name":"23号机","status":1},{"id":"1100813036","type":2,"name":"24号机","status":1},{"id":"1100813038","type":2,"name":"26号机","status":1},{"id":"1100813041","type":2,"name":"29号机","status":1},{"id":"1100813042","type":2,"name":"25号机","status":1},{"id":"1100813043","type":2,"name":"31号机","status":1},{"id":"1100813044","type":2,"name":"32号机","status":1},{"id":"1100813045","type":2,"name":"33号机","status":1},{"id":"1100813046","type":2,"name":"34号机","status":1},{"id":"1100813049","type":2,"name":"37号机","status":1},{"id":"1100813051","type":2,"name":"39号机","status":1},{"id":"1100813052","type":2,"name":"40号机","status":1},{"id":"1100813053","type":2,"name":"41号机","status":1},{"id":"1100813054","type":2,"name":"42号机","status":1},{"id":"1100813055","type":2,"name":"44号机","status":1},{"id":"1100813059","type":2,"name":"48号机","status":1},{"id":"1100813060","type":2,"name":"49号机","status":1},{"id":"1100813061","type":2,"name":"50号机","status":1},{"id":"1100813062","type":2,"name":"51号机","status":1},{"id":"1100813064","type":2,"name":"53号机","status":1},{"id":"1100813065","type":2,"name":"54号机","status":1},{"id":"1100813066","type":2,"name":"55号机","status":1},{"id":"1100813067","type":2,"name":"56号机","status":1}],"goodsPage":2},"t":17xxxxxxx}

fetch("https://userapi.qiekj.com/goods/normal/details", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "content-type": "multipart/form-data; boundary=----WebKitFormBoundarykZvHVUctUtOUwFD2",
    "phonebrand": "DEFAULT",
    "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "uid": "undefined"
  },
  "referrer": "https://h5.qiekj.com/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "------WebKitFormBoundarykZvHVUctUtOUwFD2\r\nContent-Disposition: form-data; name=\"goodsId\"\r\n\r\n1100813021\r\n------WebKitFormBoundarykZvHVUctUtOUwFD2--\r\n",
  "method": "POST",
  "mode": "cors",
  "credentials": "omit"
});
{
  "code": 0,
  "msg": "成功",
  "data": {
      "goodsId": 1100813021,
      "name": "9号机",
      "categoryCode": "00",
      "subCategoryId": 1070,
      "orgId": 200088975,
      "orgName": "北京邮电大学雁北洗衣房1",
      "orgAttribute": 0,
      "positionId": 0,
      "soldState": 2,
      "stockType": 102,
      "payTypes": [
          1,
          2,
          3,
          6
      ],
      "createTime": "2023-12-29 13:30:57",
      "deviceId": 50805544,
      "communication": "pulse",
      "brandName": "斯博林北京邮电大学",
      "brandLogo": "https://static.qiekj.com/images/2024/01/02/1059448950261547972",
      "brandExposure": "https://static.qiekj.com/images/2024/01/02/1059448501831729551",
      "serviceTelephone": "1538xxxxxxx",
      "consumerServiceVOs": [
          {
              "phone": "1538xxxxxxx",
              "name": null,
              "avatar": null,
              "type": 1,
              "desc": null
          }
      ],
      "isReserve": 1,
      "remainTime": 0,
      "isBluetooth": 0,
      "payment": "before",
      "imei": "864946066821108",
      "machineId": "202312291330587490002313855716505",
      "shopId": "202401041041470000069996565184",
      "deviceErrorCode": 2,
      "deviceErrorMsg": "设备工作中，请更换设备使用",
      "extAttr": null,
      "extAttrObj": null,
      "payModel": 0,
      "supportAppUserFinish": false,
      "tradeMain": 101
  },
  "t": 17258xxxxxxx
}



[1100812842, 1100812845, 1100812846, 1100812847, 1100812848, 1100812849, 1100812850, 1100812851, 1100812852, 1100812853, 1100812854, 1100812855, 1100812860, 1100812862, 1100812863, 1100812866, 1100812867, 1100812868, 1100812869, 1100812870, 1100812871, 1100812872, 1100812873, 1100812874, 1100812875, 1100812876, 1100812877, 1100812878, 1100812879, 1100812880, 1100812882, 1100812883, 1100812884, 1100812885, 1100812886, 1100812887, 1100812888, 1100812889, 1100812890, 1100812891, 1100812892, 1100812893, 1100812894, 1100812895, 1100812896, 1100812897, 1100812898, 1100812899, 1100812900, 1100812901, 1100812902, 1100812903, 1100812904, 1100812905, 1100812906, 1100812907, 1100812908, 1100812909, 1100812910, 1100812911, 1100812912, 1100812913, 1100812914, 1100812915, 1100812916, 1100812918, 1100812919, 1100812920, 1100812921, 1100812922, 1100812926, 1100812927, 1100812961, 1100812962, 1100812963, 1100813013, 1100813014, 1100813015, 1100813016, 1100813017, 1100813018, 1100813019, 1100813020, 1100813021, 1100813022, 1100813023, 1100813024, 1100813026, 1100813027, 1100813028, 1100813029, 1100813030, 1100813031, 1100813032, 1100813033, 1100813034, 1100813035, 1100813036, 1100813038, 1100813041, 1100813043, 1100813045, 1100813046, 1100813047, 1100813048, 1100813049, 1100813050, 1100813051, 1100813052, 1100813053, 1100813054, 1100813055, 1100813056, 1100813057, 1100813058, 1100813059, 1100813060, 1100813061, 1100813062, 1100813063, 1100813064, 1100813066, 1100813067, 1100813068]
