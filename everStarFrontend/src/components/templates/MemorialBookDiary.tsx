import React, { useState } from 'react';
import { InputContainer } from 'components/organics/input/InputContainer';
import { useParams, useNavigate } from 'react-router-dom';
import { useCreateDiary } from 'hooks/useMemorialBooks';
import { useSelector } from 'react-redux';
import { RootState } from 'store/Store';

export const MemorialBookDiary: React.FC = () => {
  const params = useParams<{ pet: string; memorialbook: string }>();
  const petId = Number(params.pet);
  const memorialBookId = Number(params.memorialbook);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { mutate: createDiary } = useCreateDiary({
    onSuccess: () => {
      alert('일기가 성공적으로 작성되었습니다.');
      navigate(-1); // 이전 페이지로 이동
    },
    onError: (error) => {
      console.error('Error creating diary:', error);
      alert('일기 작성에 실패했습니다.');
    },
  });

  const handleCreateDiary = () => {
    createDiary({
      petId,
      memorialBookId,
      title,
      content,
      imageFile,
      token: token || '',
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
    }
  };

  return (
    <InputContainer
      headerText='일기 작성'
      textboxLabel='내용'
      largeButtonText='이미지 추가'
      smallButtonText='작성 완료'
      showPrimaryButton={true}
      customText='반려동물에게 일기를 작성해보세요.'
      letterCardType={undefined}
      letterCardColor={undefined}
      letterCardState={undefined}
      letterCardMessage={undefined}
      myName={undefined}
      petName={undefined}
      myMessage={undefined}
      letterCardClassName={undefined}
      centered={true}
      dateTime={undefined}
      onPrimaryButtonClick={handleCreateDiary}
    >
      <input
        type='text'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='제목을 입력하세요'
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder='내용을 입력하세요'
      />
      <input type='file' onChange={handleFileChange} />
    </InputContainer>
  );
};
