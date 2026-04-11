import { HTTP_URL } from '@/config';
import axios from 'axios';
import { getAuthHeaders } from './room';

export const getExistingShapes = async (roomId: string) => {
  try {
    console.log('before calling api ');
    const response = await axios.get(
      `${HTTP_URL}/canvas/get-canvas-design/${roomId}`,
      { headers: getAuthHeaders() },
    );

    console.log('after calling api ');
    return response.data.Shapes;
  } catch (error: unknown) {
    console.log('error in api calling ');
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || 'failed to get canvas shapes',
      );
    }
    throw new Error('Unexpected error occurred while fetching canvas shapes.');
  }
};
