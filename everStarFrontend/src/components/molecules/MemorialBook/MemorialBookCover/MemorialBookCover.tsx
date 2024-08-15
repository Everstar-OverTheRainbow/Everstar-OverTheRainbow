import React from 'react';
import { AtomBookcover } from 'components/atoms/images/Bookcover/Bookcover';
import { Avatar } from 'components/atoms/symbols/Avatar/Avatar';

interface MemorialBookCoverProps {
  className?: string;
  src?: string;
}

export const MemorialBookCover: React.FC<MemorialBookCoverProps> = ({
  className,
  src,
}) => {
  return (
    <div
      className={`flex w-[360px] h-[508px] items-center justify-center relative border border-solid border-black shadow-[0px_4px_4px_#00000040] ${className}`}
    >
      <AtomBookcover />
      <Avatar
        src={src}
        size='large'
        name='memorial'
        className='!absolute !left-[100px] !top-[130px]'
      />
    </div>
  );
};

export type { MemorialBookCoverProps };
