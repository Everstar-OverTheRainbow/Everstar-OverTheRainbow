import React from 'react';

interface DiaryPageProps {
  title: string;
  content: string;
  imageUrl?: string;
}

export const DiaryPage: React.FC<DiaryPageProps> = ({
  title,
  content,
  imageUrl,
}) => {
  return (
    <div className='relative flex flex-col items-center p-5 h-[508px] w-[360px] mx-auto bg-white border border-gray-300 shadow-md'>
      <div className='w-full mb-4 text-center'>
        <h2 className='text-xl font-bold leading-tight tracking-wide text-greyscaleblack-100'>
          {title}
        </h2>
      </div>
      <div className='flex flex-col items-center w-full mt-4 space-y-4'>
        {imageUrl && (
          <img
            src={imageUrl}
            alt='Diary entry'
            className='w-[180px] h-[135px] object-cover'
          />
        )}
        <p className='text-base leading-tight tracking-wide font-kor-p-p1 text-greyscaleblack-100'>
          {content}
        </p>
      </div>
    </div>
  );
};
