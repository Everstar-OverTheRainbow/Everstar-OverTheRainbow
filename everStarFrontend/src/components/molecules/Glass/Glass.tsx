import React from 'react';
import { PageIndicator } from 'components/molecules/PageIndicator/PageIndicator';

interface GlassProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  showPageIndicator?: boolean;
  className?: string;
}

export const Glass: React.FC<GlassProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageIndicator = true,
  className = '',
}) => {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center ${className}`}
    >
      <div className='flex flex-col md:flex-row items-end justify-center gap-2.5 p-4 w-full h-full md:w-auto md:h-auto bg-[#ffffff6b] rounded-[20px] overflow-hidden border-[0.5px] border-solid border-white shadow-[0px_4px_4px_#00000040] backdrop-blur-sm backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(4px)_brightness(100%)]'>
        {showPageIndicator && (
          <PageIndicator
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </div>
  );
};
