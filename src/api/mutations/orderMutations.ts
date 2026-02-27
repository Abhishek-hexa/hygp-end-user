import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';

import { orderService } from '../services/orderService';
import {
  CreateOrderPayload,
  CreateOrderResponse,
  UploadDesignerImageResponse,
} from '../types';

export const useCreateOrderMutation = (
  options?: UseMutationOptions<CreateOrderResponse, Error, CreateOrderPayload>,
): UseMutationResult<CreateOrderResponse, Error, CreateOrderPayload> =>
  useMutation({
    // TEMPORARY: create flow disabled
    // mutationFn: (payload) => orderService.createOrder(payload),
    mutationFn: async (payload) => {
      void payload;
      throw new Error('createOrder mutation is temporarily disabled');
    },
    ...options,
  });

export const useUploadDesignerImageMutation = (
  options?: UseMutationOptions<UploadDesignerImageResponse, Error, File>,
): UseMutationResult<UploadDesignerImageResponse, Error, File> =>
  useMutation({
    mutationFn: (file) => orderService.uploadDesignerImage(file),
    ...options,
  });
