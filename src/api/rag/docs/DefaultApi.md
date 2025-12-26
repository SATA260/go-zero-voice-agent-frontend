# DefaultApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**docDeleteDoc**](#docdeletedoc) | **DELETE** /rag/v1/doc/{id} | 删除上传文件|
|[**docListDoc**](#doclistdoc) | **POST** /rag/v1/doc/list | 分页查询上传文件|
|[**docListDocChunks**](#doclistdocchunks) | **POST** /rag/v1/doc/{fileId}/chunks | 分页查询文件切片|
|[**docUploadAndEmbed**](#docuploadandembed) | **POST** /rag/v1/doc/upload | 上传文件并向量化|

# **docDeleteDoc**
> DocDeleteDoc200Response docDeleteDoc()



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

const { status, data } = await apiInstance.docDeleteDoc(
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

**DocDeleteDoc200Response**

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

# **docListDoc**
> DocListDoc200Response docListDoc(docListDocRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DocListDocRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let docListDocRequest: DocListDocRequest; //
let xUserId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.docListDoc(
    docListDocRequest,
    xUserId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **docListDocRequest** | **DocListDocRequest**|  | |
| **xUserId** | [**number**] |  | (optional) defaults to undefined|


### Return type

**DocListDoc200Response**

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

# **docListDocChunks**
> DocListDocChunks200Response docListDocChunks(docListDocChunksRequest)



### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DocListDocChunksRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let fileId: string; // (default to undefined)
let docListDocChunksRequest: DocListDocChunksRequest; //
let xUserId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.docListDocChunks(
    fileId,
    docListDocChunksRequest,
    xUserId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **docListDocChunksRequest** | **DocListDocChunksRequest**|  | |
| **fileId** | [**string**] |  | defaults to undefined|
| **xUserId** | [**number**] |  | (optional) defaults to undefined|


### Return type

**DocListDocChunks200Response**

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

# **docUploadAndEmbed**
> DocUploadAndEmbed200Response docUploadAndEmbed()



### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let filename: string; // (default to undefined)
let file: File; // (default to undefined)
let xUserId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.docUploadAndEmbed(
    filename,
    file,
    xUserId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **filename** | [**string**] |  | defaults to undefined|
| **file** | [**File**] |  | defaults to undefined|
| **xUserId** | [**number**] |  | (optional) defaults to undefined|


### Return type

**DocUploadAndEmbed200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

