# DefaultApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**chatmessageDeleteChatMessage**](#chatmessagedeletechatmessage) | **DELETE** /llm/v1/chat-message/{id} | 删除聊天消息|
|[**chatmessageListChatMessageBySession**](#chatmessagelistchatmessagebysession) | **POST** /llm/v1/chat-message/list | 根据会话分页查询消息|
|[**chatsessionDeleteChatSession**](#chatsessiondeletechatsession) | **DELETE** /llm/v1/chat-session/{id} | 删除会话|
|[**chatsessionGetChatSession**](#chatsessiongetchatsession) | **GET** /llm/v1/chat-session/{id} | 查询会话详情|
|[**chatsessionListChatSession**](#chatsessionlistchatsession) | **POST** /llm/v1/chat-session/list | 分页查询会话列表|
|[**configCreateConfig**](#configcreateconfig) | **POST** /llm/v1/config/create | 创建配置|
|[**configDeleteConfig**](#configdeleteconfig) | **DELETE** /llm/v1/config/{id} | 删除配置|
|[**configGetConfig**](#configgetconfig) | **GET** /llm/v1/config/{id} | 获取配置详情|
|[**configListMyConfig**](#configlistmyconfig) | **POST** /llm/v1/config/list | 分页查询我的配置|
|[**configUpdateConfig**](#configupdateconfig) | **PUT** /llm/v1/config/{id} | 更新配置|

<<<<<<< HEAD
# **chatmessageDeleteChatMessage**
> object chatmessageDeleteChatMessage()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)
let xUserId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.chatmessageDeleteChatMessage(
    id,
    xUserId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|
| **xUserId** | [**number**] |  | (optional) defaults to undefined|


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

# **chatmessageListChatMessageBySession**
> ChatmessageListChatMessageBySession200Response chatmessageListChatMessageBySession(chatmessageListChatMessageBySessionRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    ChatmessageListChatMessageBySessionRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let chatmessageListChatMessageBySessionRequest: ChatmessageListChatMessageBySessionRequest; //
let xUserId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.chatmessageListChatMessageBySession(
    chatmessageListChatMessageBySessionRequest,
    xUserId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chatmessageListChatMessageBySessionRequest** | **ChatmessageListChatMessageBySessionRequest**|  | |
| **xUserId** | [**number**] |  | (optional) defaults to undefined|


### Return type

**ChatmessageListChatMessageBySession200Response**

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

# **chatsessionDeleteChatSession**
> object chatsessionDeleteChatSession()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)
let xUserId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.chatsessionDeleteChatSession(
    id,
    xUserId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|
| **xUserId** | [**number**] |  | (optional) defaults to undefined|


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

# **chatsessionGetChatSession**
> ChatsessionGetChatSession200Response chatsessionGetChatSession()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)
let xUserId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.chatsessionGetChatSession(
    id,
    xUserId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|
| **xUserId** | [**number**] |  | (optional) defaults to undefined|


### Return type

**ChatsessionGetChatSession200Response**

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

# **chatsessionListChatSession**
> ChatsessionListChatSession200Response chatsessionListChatSession(chatsessionListChatSessionRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    ChatsessionListChatSessionRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let chatsessionListChatSessionRequest: ChatsessionListChatSessionRequest; //
let xUserId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.chatsessionListChatSession(
    chatsessionListChatSessionRequest,
    xUserId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chatsessionListChatSessionRequest** | **ChatsessionListChatSessionRequest**|  | |
| **xUserId** | [**number**] |  | (optional) defaults to undefined|


### Return type

**ChatsessionListChatSession200Response**

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

=======
>>>>>>> a8301e9651eebb5f440e404761d96b2c65db03c1
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
let xUserId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.configCreateConfig(
    configCreateConfigBody,
    xUserId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **configCreateConfigBody** | **ConfigCreateConfigBody**|  | |
| **xUserId** | [**number**] |  | (optional) defaults to undefined|


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
let xUserId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.configDeleteConfig(
    id,
    xUserId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|
| **xUserId** | [**number**] |  | (optional) defaults to undefined|


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
let xUserId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.configGetConfig(
    id,
    xUserId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|
| **xUserId** | [**number**] |  | (optional) defaults to undefined|


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
let xUserId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.configListMyConfig(
    configListMyConfigRequest,
    xUserId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **configListMyConfigRequest** | **ConfigListMyConfigRequest**|  | |
| **xUserId** | [**number**] |  | (optional) defaults to undefined|


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
let xUserId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.configUpdateConfig(
    id,
    configCreateConfigBody,
    xUserId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **configCreateConfigBody** | **ConfigCreateConfigBody**|  | |
| **id** | [**number**] |  | defaults to undefined|
| **xUserId** | [**number**] |  | (optional) defaults to undefined|


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

