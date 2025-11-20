# DefaultApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**userDetail**](#userdetail) | **GET** /usercenter/v1/user/info | get rpc info|
|[**userLogin**](#userlogin) | **POST** /usercenter/v1/user/login | login|
|[**userRegister**](#userregister) | **POST** /usercenter/v1/user/register | register|
|[**userSendCode**](#usersendcode) | **POST** /usercenter/v1/user/sendCode | send code|
|[**userVerifyToken**](#userverifytoken) | **POST** /usercenter/v1/user/auth | auth by token|

# **userDetail**
> UserDetail200Response userDetail()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (default to undefined)

const { status, data } = await apiInstance.userDetail(
    authorization
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **authorization** | [**string**] |  | defaults to undefined|


### Return type

**UserDetail200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userLogin**
> UserLogin200Response userLogin(userLoginRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UserLoginRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userLoginRequest: UserLoginRequest; //

const { status, data } = await apiInstance.userLogin(
    userLoginRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userLoginRequest** | **UserLoginRequest**|  | |


### Return type

**UserLogin200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userRegister**
> UserLogin200Response userRegister(userRegisterRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UserRegisterRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userRegisterRequest: UserRegisterRequest; //

const { status, data } = await apiInstance.userRegister(
    userRegisterRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userRegisterRequest** | **UserRegisterRequest**|  | |


### Return type

**UserLogin200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userSendCode**
> UserSendCode200Response userSendCode(userSendCodeRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UserSendCodeRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userSendCodeRequest: UserSendCodeRequest; //

const { status, data } = await apiInstance.userSendCode(
    userSendCodeRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userSendCodeRequest** | **UserSendCodeRequest**|  | |


### Return type

**UserSendCode200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userVerifyToken**
> UserVerifyToken200Response userVerifyToken()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let authorization: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.userVerifyToken(
    authorization
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **authorization** | [**string**] |  | (optional) defaults to undefined|


### Return type

**UserVerifyToken200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

