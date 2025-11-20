# DefaultApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**configCreateConfig**](#configcreateconfig) | **POST** /llm/v1/config/create | 创建配置|
|[**configDeleteConfig**](#configdeleteconfig) | **DELETE** /llm/v1/config/{id} | 删除配置|
|[**configGetConfig**](#configgetconfig) | **GET** /llm/v1/config/{id} | 获取配置详情|
|[**configListMyConfig**](#configlistmyconfig) | **POST** /llm/v1/config/list | 分页查询我的配置|
|[**configUpdateConfig**](#configupdateconfig) | **PUT** /llm/v1/config/{id} | 更新配置|

# **configCreateConfig**
> ConfigCreateConfig200Response configCreateConfig(configCreateConfigBody)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    ConfigCreateConfigBody
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let configCreateConfigBody: ConfigCreateConfigBody; //

const { status, data } = await apiInstance.configCreateConfig(
    configCreateConfigBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **configCreateConfigBody** | **ConfigCreateConfigBody**|  | |


### Return type

**ConfigCreateConfig200Response**

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

# **configDeleteConfig**
> object configDeleteConfig()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.configDeleteConfig(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**object**

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

# **configGetConfig**
> ConfigGetConfig200Response configGetConfig()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.configGetConfig(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ConfigGetConfig200Response**

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

# **configListMyConfig**
> ConfigListMyConfig200Response configListMyConfig(configListMyConfigRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    ConfigListMyConfigRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let configListMyConfigRequest: ConfigListMyConfigRequest; //

const { status, data } = await apiInstance.configListMyConfig(
    configListMyConfigRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **configListMyConfigRequest** | **ConfigListMyConfigRequest**|  | |


### Return type

**ConfigListMyConfig200Response**

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

# **configUpdateConfig**
> object configUpdateConfig(configCreateConfigBody)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    ConfigCreateConfigBody
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)
let configCreateConfigBody: ConfigCreateConfigBody; //

const { status, data } = await apiInstance.configUpdateConfig(
    id,
    configCreateConfigBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **configCreateConfigBody** | **ConfigCreateConfigBody**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**object**

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

