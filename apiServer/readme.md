# 基于Express的node数据接口服务

## 返回数组

{
  "success": true,
  "result": ["value-1", "value-2"]
}

## 返回对象

{
  "success": true,
  "result": {"field-1": "field-value-1"}
}

## 分页列表

{
  "success": true,
  "page": {
    "pageNo": 1, // 必传 从1开始代表第一页
    "pageSize": 10, // 每页多少条数据
    "order": "asc", // "asc" | "desc" 可选
    "orderBy": "userName", // 可选
    "result": [
        {
            "userName": "user1", // 用户名
            "userId": "1234567890", // 用户ID
            "email": "user1@baidu.com", // 用户email
            "state": "Active" // 用户状态，枚举型，详情见下方描述
        },
        {
            "userName": "user2",
            "userId": "2234567890",
            "email": "user2@baidu.com",
            "state": "Creating"
        }
    ]
  }
}

## 列表数据获取全部数据

{
    success: true,
    result: [
        {
            "userName": "user1", // 用户名
            "userId": "1234567890", // 用户ID
            "email": "user1@baidu.com", // 用户email
        },
        {
            "userName": "user2",
            "userId": "2234567890",
            "email": "user2@baidu.com",
        }
    ]
}

## 错误返回

{
  "success": false,
  "code": "notFound", // 当success false必传 这边其实是errorCode! 不是http code!
  "message": {
      "global": "这里是错误信息" // 直接给用户看的错误信息，是要友好的。
  }
}

## 错误返回-表单字段错误

{
  "success": false,
  "code": "notFound",
  "message": {
    "field": {
        "key1": "错误信息1",
        "key2": "错误信息2"
    }
  }
}

## redirect：表示重定向

{
  "success": false,
  "code": "xxx"
  "message": {
      "redirect": "/login"
  }
}
