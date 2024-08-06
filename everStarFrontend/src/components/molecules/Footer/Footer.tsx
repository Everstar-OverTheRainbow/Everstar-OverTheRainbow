import React from 'react';
import { LogoIcons } from 'components/atoms/symbols/Logo/LogoIcons';
import { SNSIcons } from 'components/atoms/symbols/SNS/SNSIcons';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={`flex flex-col items-center justify-center w-full z-50 ${className}`}
    >
      <div className='flex flex-col items-center justify-center w-full border-t border-gray-900 py-4 px-4 md:px-8'>
        <div className='flex items-center justify-between w-full max-w-screen-lg'>
          <LogoIcons variant='small-star' className='mr-8' />
          <div className='flex flex-col items-end'>
            <div className='flex items-center gap-4 mb-2'>
              <span className='hidden sm:block text-sm font-bold text-gray-900 opacity-70'>
                Social media
              </span>
              <div className='flex items-center gap-4'>
                <SNSIcons variant='patron' />
                <SNSIcons variant='notion' />
                <SNSIcons variant='youtube' />
                <SNSIcons variant='instagram' />
              </div>
            </div>
            <p className='text-xs md:text-sm font-bold text-gray-900 opacity-70'>
              Copyright © 2024 • SSAFY B101
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export type { FooterProps };
