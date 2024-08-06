import React from 'react';
import PropTypes from 'prop-types';

interface QuestionPageProps {
  title: string;
  myAnswer: string;
  petName: string;
  petAnswer?: string; // Marked as optional
}

const QuestionPage: React.FC<QuestionPageProps> = ({
  title,
  myAnswer,
  petName,
  petAnswer,
}) => {
  return (
    <div className='relative flex flex-col items-center p-5 h-[508px] w-[360px] mx-auto bg-white border border-gray-300 shadow-md'>
      <div className='text-center mb-8'>
        <span className='block text-xl font-bold leading-tight tracking-wide font-kor-h-h2 text-greyscaleblack-100'>
          Q.
        </span>
        <p className='mt-2 text-base leading-tight tracking-wide font-kor-p-p1 text-greyscaleblack-100'>
          {title}
        </p>
      </div>
      <div className='flex flex-col items-center w-full mb-8'>
        <p className='text-base font-bold leading-6 tracking-wide text-center font-kor-subtitle-subtitle1 text-greyscaleblack-100'>
          나의 답변
        </p>
        <p className='mt-2 text-base leading-tight tracking-wide font-kor-p-p1 text-greyscaleblack-100'>
          {myAnswer}
        </p>
      </div>
      {petAnswer && (
        <div className='flex flex-col items-center w-full mb-8'>
          <p className='text-base font-bold leading-6 tracking-wide text-center font-kor-subtitle-subtitle1 text-greyscaleblack-100'>
            {petName}의 답변
          </p>
          <p className='mt-2 text-base leading-tight tracking-wide font-kor-p-p1 text-greyscaleblack-100'>
            {petAnswer}
          </p>
        </div>
      )}
    </div>
  );
};

QuestionPage.propTypes = {
  title: PropTypes.string.isRequired,
  myAnswer: PropTypes.string.isRequired,
  petName: PropTypes.string.isRequired,
  petAnswer: PropTypes.string,
};

export { QuestionPage };
export type { QuestionPageProps };
