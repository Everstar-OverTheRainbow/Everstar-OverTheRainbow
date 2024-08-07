import React from 'react';
import { ModalHeader } from 'components/molecules/ModalHeader/ModalHeader';
import { LetterCard } from 'components/molecules/cards/LetterCard/LetterCard';
import { Textbox } from 'components/molecules/input/Textbox';
import { PrimaryButton } from 'components/atoms/buttons/PrimaryButton';

export interface InputContainerProps {
  headerText: string;
  letterCardType?: 'default' | 'send' | 'receive';
  letterCardColor?: 'white' | 'bgorange' | 'orange' | 'gray';
  letterCardState?: 'received' | 'notReceived';
  petName?: string;
  myName?: string;
  letterCardMessage?: string;
  myMessage?: string;
  letterCardClassName?: string;
  centered?: boolean;
  customText?: string;
  dateTime?: string;
  textboxLabel: string;
  largeButtonText: string;
  smallButtonText: string;
  showPrimaryButton?: boolean;
  onPrimaryButtonClick?: () => void;
  children?: React.ReactNode; // 추가된 속성
}

export const InputContainer: React.FC<InputContainerProps> = ({
  headerText,
  letterCardType,
  letterCardColor = 'white',
  letterCardState = 'notReceived',
  letterCardMessage,
  myName,
  petName,
  myMessage,
  letterCardClassName = 'font-body !kor-subtitle-subtitle3',
  centered = true,
  customText = '',
  textboxLabel,
  largeButtonText,
  smallButtonText,
  dateTime,
  showPrimaryButton = true,
  onPrimaryButtonClick,
  children, // 추가된 속성
}) => {
  const handleButtonClick = () => {
    if (onPrimaryButtonClick) {
      onPrimaryButtonClick();
    } else {
      console.log('Primary Button Clicked');
    }
  };

  const handleReplyClick = () => {
    console.log('답장하기 버튼 클릭');
  };

  return (
    <div className='flex justify-center p-6 bg-gray-100'>
      <div
        className='flex flex-col items-center w-[360px] gap-8 p-5 bg-white rounded-lg shadow-md'
        style={{ maxHeight: '742px', overflowY: 'auto' }}
      >
        <ModalHeader text={headerText} showLeftIcon={true} />
        <div className='flex flex-col items-center w-full gap-8'>
          <div className='flex flex-col items-center w-full'>
            {letterCardType ? (
              <LetterCard
                name={myName ? `${myName}에게` : undefined}
                type='send'
                color={
                  letterCardType === 'receive' ? 'bgorange' : letterCardColor
                }
                state={letterCardState}
                message={letterCardMessage}
                className={letterCardClassName}
                centered={centered}
                dateTime={dateTime}
              />
            ) : (
              <div className='w-full'>
                <div
                  className="left-0 [font-family:'Noto_Sans_KR-Medium',Helvetica] font-medium text-[#1f2329] text-2xl tracking-[-2.40px] leading-[normal]"
                  dangerouslySetInnerHTML={{ __html: customText }}
                />
              </div>
            )}
          </div>
          <div className='flex w-full'>
            {letterCardType === 'receive' ? (
              <div className='flex flex-col justify-center'>
                <LetterCard
                  name={`${petName}에게`}
                  type='receive'
                  color='white'
                  state={letterCardState}
                  message={myMessage}
                  className={letterCardClassName}
                  dateTime={dateTime}
                  centered={centered}
                />
                <div className='mt-4'>
                  <PrimaryButton
                    theme='white'
                    size='large'
                    disabled={false}
                    onClick={handleReplyClick}
                  >
                    답장하기
                  </PrimaryButton>
                </div>
              </div>
            ) : (
              <div className='flex flex-col justify-center w-full'>
                <Textbox
                  type='large'
                  className=''
                  label={textboxLabel}
                  showStar={false}
                />
                {showPrimaryButton && (
                  <div className='flex justify-center w-full'>
                    <PrimaryButton
                      theme='white'
                      size='large'
                      onClick={handleButtonClick}
                      disabled={false}
                      icon={null}
                    >
                      {largeButtonText}
                    </PrimaryButton>
                  </div>
                )}
                <div className='flex justify-end w-full mt-2'>
                  <PrimaryButton
                    theme='white'
                    size='small'
                    onClick={handleButtonClick}
                    disabled={false}
                    icon={null}
                  >
                    {smallButtonText}
                  </PrimaryButton>
                </div>
              </div>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
