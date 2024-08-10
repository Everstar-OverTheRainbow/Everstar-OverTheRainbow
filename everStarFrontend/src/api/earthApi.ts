import axios from 'axios';
import config from 'config';

export interface Letter {
  requestDto: string;
  image: string;
}

export const fetchLetterRePost = async (
  data: FormData,
  token: string,
  petId: number,
  letterId: number
) => {
  const response = await fetch(
    `${config.API_BASE_URL}/api/pets/${petId}/letters/${letterId}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    }
  );

  console.log('Response status:', response.status);
  if (!response.ok) {
    throw new Error('편지 보내기에 실패했습니다');
  }

  const result = await response.json();
  console.log('post letter response:', result);
  return result;
};

export const fetchLetterPost = async (
  data: FormData,
  token: string,
  petId: number
) => {
  const response = await fetch(
    `${config.API_BASE_URL}/api/pets/${petId}/letters`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    }
  );

  console.log('Response status:', response.status);
  if (!response.ok) {
    throw new Error('편지 보내기에 실패했습니다');
  }

  const result = await response.json();
  console.log('post letter response:', result);
  return result;
};

export const fetchLetterPet = async (petId: number, token: string) => {
  const response = await fetch(
    `${config.API_BASE_URL}/api/pets/${petId}/letters`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log('Response status:', response.status);
  if (!response.ok) {
    throw new Error('편지 정보를 가져오는 데 실패했습니다');
  }

  const result = await response.json();
  console.log('Fetched pet letters:', result);

  return result;
};

export const fetchLetterPetDetail = async (
  petId: number,
  token: string,
  letterId: number
) => {
  const response = await fetch(
    `${config.API_BASE_URL}/api/pets/${petId}/letters/${letterId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log('Response status:', response.status);
  if (!response.ok) {
    throw new Error('편지 정보를 가져오는 데 실패했습니다');
  }

  const result = await response.json();
  console.log('Fetched pet letters:', result);

  return result;
};


export const postOpenVidueSession = async () => {
  try{
    const response = await axios.post(`${config.API_BASE_URL}/api/sessions`);
    console.log(response.data);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      alert(err.response?.data?.errorMessage || '알 수 없는 오류가 발생했습니다.');
    } else {
      alert('알 수 없는 오류가 발생했습니다.');
    }
    return null;
  }
}