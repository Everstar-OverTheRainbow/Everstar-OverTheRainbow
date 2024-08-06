import React from 'react';

export interface ImagePageProps {
  question: string;
  petName: string;
  myImage: string;
  myAnswer: string;
  petImage?: string;
  petAnswer?: string;
}

export const ImagePage: React.FC<ImagePageProps> = ({
  question,
  petName,
  myImage,
  myAnswer,
  petImage,
  petAnswer,
}) => {
  return (
    <div className='relative flex flex-col p-5 h-[508px] w-[360px] mx-auto bg-white border border-gray-300 shadow-lg rounded-md'>
      <div className='text-center mb-4'>
        <span className='block text-xl font-bold leading-tight tracking-wide font-kor-h-h2 text-greyscaleblack-100'>
          Q.
        </span>
        <p className='mt-2 text-base leading-tight tracking-wide font-kor-p-p1 text-greyscaleblack-100'>
          {question}
        </p>
      </div>
      <div className='flex items-start w-full mt-4'>
        <img
          src={myImage}
          alt='My Answer'
          className='w-[180px] h-[135px] object-cover mr-4 shadow-sm rounded-md'
        />
        <div className='flex flex-col'>
          <p className='text-base font-bold leading-6 tracking-wide text-center font-kor-subtitle-subtitle1 text-greyscaleblack-100 mb-2'>
            나의 답변
          </p>
          <p className='text-base leading-tight tracking-wide font-kor-p-p1 text-greyscaleblack-100'>
            {myAnswer}
          </p>
        </div>
      </div>
      {petImage && petAnswer && (
        <div className='flex items-start w-full mt-4'>
          <img
            src={petImage}
            alt="Pet's Answer"
            className='w-[180px] h-[135px] object-cover mr-4 shadow-sm rounded-md'
          />
          <div className='flex flex-col'>
            <p className='text-base font-bold leading-6 tracking-wide text-center font-kor-subtitle-subtitle1 text-greyscaleblack-100 mb-2'>
              {petName}의 답변
            </p>
            <p className='text-base leading-tight tracking-wide font-kor-p-p1 text-greyscaleblack-100'>
              {petAnswer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
