<AUTH> api needs the following header to be set
```json
{
    Login-Token: 'jwttokenfromserver'
}
```

On server computation error will return 200 with the error field in the response
```json
{
    "error": "errormessage",
}
```

[POST] /login

request schema
```json
{
    email: "emailanjing@ethereum.com",
    password: "passwordnyadihashyapak",
}
```

response schema
```json
{
    token: "jwt-token-nanti-isinya",
}
```

[POST] /register

request schema
```json
{
    email: "emailanjing@ethereum.com",
    password: "passwordnyadihashyapak",
}
```

response schema
```json
{
    token: "jwt-token-nanti-isinya",
}
```

<AUTH> [GET] /get_profile/<id> 

response
```json
{
    "first_name": "namalu",
    "last_name": "namalu",
    "address": "alamatlu",
}
```

<AUTH> [POST] /update_non_sensitive

request
```json
{
    "address": "alamatlu",
}
```

response
```json
{
   "message": "update success" 
}
```
