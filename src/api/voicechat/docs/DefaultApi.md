# DefaultApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**asrCreateAsrConfig**](#asrcreateasrconfig) | **POST** /voice/v1/asr/config | 创建ASR配置|
|[**asrDeleteAsrConfig**](#asrdeleteasrconfig) | **DELETE** /voice/v1/asr/config/{id} | 删除ASR配置|
|[**asrGetAsrConfig**](#asrgetasrconfig) | **GET** /voice/v1/asr/config/{id} | 获取ASR配置详情|
|[**asrListAsrConfig**](#asrlistasrconfig) | **POST** /voice/v1/asr/configs | 分页获取ASR配置列表|
|[**asrUpdateAsrConfig**](#asrupdateasrconfig) | **PUT** /voice/v1/asr/config/{id} | 更新ASR配置|
|[**chatStart**](#chatstart) | **GET** /voice/v1/chat/start | 创建websocket连接,然后帮助建立webrtc连接|
|[**ttsCreateTtsConfig**](#ttscreatettsconfig) | **POST** /voice/v1/tts/config | 创建TTS配置|
|[**ttsDeleteTtsConfig**](#ttsdeletettsconfig) | **DELETE** /voice/v1/tts/config/{id} | 删除TTS配置|
|[**ttsGetTtsConfig**](#ttsgetttsconfig) | **GET** /voice/v1/tts/config/{id} | 获取TTS配置详情|
|[**ttsListTtsConfig**](#ttslistttsconfig) | **POST** /voice/v1/tts/configs | 分页获取TTS配置列表|
|[**ttsUpdateTtsConfig**](#ttsupdatettsconfig) | **PUT** /voice/v1/tts/config/{id} | 更新TTS配置|

# **asrCreateAsrConfig**
> AsrCreateAsrConfig200Response asrCreateAsrConfig(asrCreateAsrConfigBody)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    AsrCreateAsrConfigBody
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let asrCreateAsrConfigBody: AsrCreateAsrConfigBody; //
let xUserId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.asrCreateAsrConfig(
    asrCreateAsrConfigBody,
    xUserId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **asrCreateAsrConfigBody** | **AsrCreateAsrConfigBody**|  | |
| **xUserId** | [**number**] |  | (optional) defaults to undefined|


### Return type

**AsrCreateAsrConfig200Response**

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

# **asrDeleteAsrConfig**
> object asrDeleteAsrConfig()



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

const { status, data } = await apiInstance.asrDeleteAsrConfig(
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

# **asrGetAsrConfig**
> AsrGetAsrConfig200Response asrGetAsrConfig()



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

const { status, data } = await apiInstance.asrGetAsrConfig(
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

**AsrGetAsrConfig200Response**

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

# **asrListAsrConfig**
> AsrListAsrConfig200Response asrListAsrConfig(asrListAsrConfigBody)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    AsrListAsrConfigBody
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let asrListAsrConfigBody: AsrListAsrConfigBody; //
let xUserId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.asrListAsrConfig(
    asrListAsrConfigBody,
    xUserId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **asrListAsrConfigBody** | **AsrListAsrConfigBody**|  | |
| **xUserId** | [**number**] |  | (optional) defaults to undefined|


### Return type

**AsrListAsrConfig200Response**

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

# **asrUpdateAsrConfig**
> object asrUpdateAsrConfig(asrCreateAsrConfigBody)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    AsrCreateAsrConfigBody
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)
let asrCreateAsrConfigBody: AsrCreateAsrConfigBody; //
let xUserId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.asrUpdateAsrConfig(
    id,
    asrCreateAsrConfigBody,
    xUserId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **asrCreateAsrConfigBody** | **AsrCreateAsrConfigBody**|  | |
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

# **chatStart**
> object chatStart(chatStartRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    ChatStartRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let chatStartRequest: ChatStartRequest; //
let xUserId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.chatStart(
    chatStartRequest,
    xUserId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chatStartRequest** | **ChatStartRequest**|  | |
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

# **ttsCreateTtsConfig**
> AsrCreateAsrConfig200Response ttsCreateTtsConfig(ttsCreateTtsConfigBody)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    TtsCreateTtsConfigBody
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let ttsCreateTtsConfigBody: TtsCreateTtsConfigBody; //
let xUserId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.ttsCreateTtsConfig(
    ttsCreateTtsConfigBody,
    xUserId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **ttsCreateTtsConfigBody** | **TtsCreateTtsConfigBody**|  | |
| **xUserId** | [**number**] |  | (optional) defaults to undefined|


### Return type

**AsrCreateAsrConfig200Response**

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

# **ttsDeleteTtsConfig**
> object ttsDeleteTtsConfig()



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

const { status, data } = await apiInstance.ttsDeleteTtsConfig(
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

# **ttsGetTtsConfig**
> TtsGetTtsConfig200Response ttsGetTtsConfig()



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

const { status, data } = await apiInstance.ttsGetTtsConfig(
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

**TtsGetTtsConfig200Response**

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

# **ttsListTtsConfig**
> TtsListTtsConfig200Response ttsListTtsConfig(asrListAsrConfigBody)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    AsrListAsrConfigBody
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let asrListAsrConfigBody: AsrListAsrConfigBody; //
let xUserId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.ttsListTtsConfig(
    asrListAsrConfigBody,
    xUserId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **asrListAsrConfigBody** | **AsrListAsrConfigBody**|  | |
| **xUserId** | [**number**] |  | (optional) defaults to undefined|


### Return type

**TtsListTtsConfig200Response**

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

# **ttsUpdateTtsConfig**
> object ttsUpdateTtsConfig(ttsCreateTtsConfigBody)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    TtsCreateTtsConfigBody
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)
let ttsCreateTtsConfigBody: TtsCreateTtsConfigBody; //
let xUserId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.ttsUpdateTtsConfig(
    id,
    ttsCreateTtsConfigBody,
    xUserId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **ttsCreateTtsConfigBody** | **TtsCreateTtsConfigBody**|  | |
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

