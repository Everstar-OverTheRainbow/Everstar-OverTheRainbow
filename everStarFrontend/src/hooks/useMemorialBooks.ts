// src/hooks/useMemorialBooks.ts
import {
  useQuery,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query';
import {
  getMemorialBooks,
  getMemorialBookById,
  MemorialBookResponse,
  createDiary,
} from 'api/memorialBookApi';

export const useMemorialBooks = (petId: number) => {
  return useQuery<MemorialBookResponse[], Error>({
    queryKey: ['memorialBooks', petId],
    queryFn: () => getMemorialBooks(petId),
    enabled: !!petId,
  });
};

export const useMemorialBookById = (petId: number, memorialBookId: number) => {
  return useQuery<MemorialBookResponse, Error>({
    queryKey: ['memorialBook', petId, memorialBookId],
    queryFn: () => getMemorialBookById(petId, memorialBookId),
    enabled: !!petId && !!memorialBookId,
  });
};

interface CreateDiaryInput {
  petId: number;
  memorialBookId: number;
  title: string;
  content: string;
  imageFile: File | null;
  token: string;
}

export const useCreateDiary = (
  options?: UseMutationOptions<void, Error, CreateDiaryInput>,
) => {
  return useMutation<void, Error, CreateDiaryInput>({
    mutationFn: (input: CreateDiaryInput) =>
      createDiary(
        input.petId,
        input.memorialBookId,
        input.title,
        input.content,
        input.imageFile,
        input.token,
      ),
    ...options,
  });
};
