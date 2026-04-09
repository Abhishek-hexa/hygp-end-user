import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const getBaseUrl = () =>
  String(import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

export const useUploadImageMutation = () => {
  return useMutation({
    mutationFn: async (blobFile: File) => {
      const formData = new FormData();
      formData.append('image', blobFile);

      const { data } = await axios.post(
        `${getBaseUrl()}/designer/upload`,
        formData,
      );

      return data;
    },
  });
};
