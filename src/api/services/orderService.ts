import { apiClient } from '../httpClient';
import { apiRoutes } from '../routes';
import {
  CreateOrderPayload,
  CreateOrderResponse,
  UploadDesignerImageResponse,
} from '../types';

export const orderService = {
  async createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
    // TEMPORARY: create flow disabled
    // const { data } = await apiClient.post<CreateOrderResponse>(
    //   apiRoutes.createOrder,
    //   payload,
    // );
    // return data;
    void payload;
    throw new Error('createOrder is temporarily disabled');
  },

  async uploadDesignerImage(file: File): Promise<UploadDesignerImageResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await apiClient.post<UploadDesignerImageResponse>(
      apiRoutes.designerUpload,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return data;
  },
};
