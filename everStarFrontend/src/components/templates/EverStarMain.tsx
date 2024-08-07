import React from 'react';
import { ProgressCard } from 'components/organics/ProgressCard/ProgressCard';
import { BookIcons } from 'components/atoms/symbols/Book/BookIcons';
import { useNavigate } from 'react-router-dom';
import { useFetchOtherPetDetails } from 'hooks/useEverStar';

type ViewMemorialBookTheme = 'focus' | 'hover' | 'white';
type ViewMemorialBookSize = 'large' | 'medium' | 'small';

interface EverStarMainProps {
  title: string;
  fill: number;
  className?: string;
  buttonTheme: ViewMemorialBookTheme;
  buttonSize: ViewMemorialBookSize;
  buttonDisabled: boolean;
  buttonText: string;
  onButtonClick: () => void;
}

interface ViewMemorialBookProps {
  theme: ViewMemorialBookTheme;
  size: ViewMemorialBookSize;
  disabled: boolean;
  children: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const ViewMemorialBook: React.FC<ViewMemorialBookProps> = ({
  theme,
  size,
  children,
  onClick,
  disabled,
}) => {
  const focus = 'bg-mainprimary text-greyscalewhite hover:bg-bgorange';
  const white = 'bg-white text-mainsecondary hover:bg-bgorange';
  const hover = 'bg-bgorange text-mainsecondary hover:bg-mainprimary';
  const disabledStyle =
    'disabled:bg-greyscaleblack-20 disabled:text-greyscaleblack-60';

  const color: Record<ViewMemorialBookTheme, string> = {
    focus,
    white,
    hover,
  };

  const large = 'w-[320px] h-[64px]';
  const medium = 'w-[134px] h-[48px]';
  const small = 'w-[106px] h-[40px]';

  const sizeStyle: Record<ViewMemorialBookSize, string> = {
    large,
    medium,
    small,
  };

  const getTextStyle = () => {
    switch (size) {
      case 'large':
        return 'kor-h-h4';
      case 'medium':
        return 'kor-subtitle-subtitle3';
      case 'small':
        return 'kor-p-p5';
      default:
        return '';
    }
  };

  return (
    <button
      className={`
        flex
        items-center
        justify-between
        rounded-lg
        px-2
        ${disabledStyle}
        ${color[theme]}
        ${sizeStyle[size]}
      `}
      disabled={disabled}
      onClick={onClick}
    >
      <span className={`flex-grow mx-auto text-center ${getTextStyle()}`}>
        {children}
      </span>
    </button>
  );
};

export const EverStarMain: React.FC<EverStarMainProps> = ({
  title,
  fill,
  buttonTheme,
  buttonSize,
  buttonDisabled,
  buttonText,
  onButtonClick,
  className,
}) => {
  useFetchOtherPetDetails();
  const navigate = useNavigate();

  const handleButtonClick = () => {
    onButtonClick();
    if (!buttonDisabled) {
      navigate('/earth');
    }
  };

  const handleViewMemorialBookClick = () => {
    if (!buttonDisabled) {
      navigate(`/everstar/${fill}/memorialbook`);
    } else {
      alert('아직 메모리얼북을 열람할 수 없어요');
    }
  };

  const isDisabled = fill < 49;
  const progressButtonText = isDisabled
    ? '아직 메모리얼북을 열람할 수 없어요'
    : '메모리얼북 열람하기';
  const progressButtonTheme = isDisabled ? 'white' : 'focus';

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <ProgressCard
        title={title}
        fill={fill}
        buttonTheme={buttonTheme}
        buttonSize={buttonSize}
        buttonDisabled={buttonDisabled}
        buttonText={buttonText}
        buttonIcon='SmallEarthImg'
        onButtonClick={handleButtonClick}
        className={className}
        showMusicControl={true}
      />
      <div className='flex flex-col items-center mt-20'>
        <BookIcons variant='book-close' />
        <div className='mt-3'>
          <ViewMemorialBook
            theme={progressButtonTheme}
            size='large'
            disabled={isDisabled}
            onClick={handleViewMemorialBookClick}
          >
            {progressButtonText}
          </ViewMemorialBook>
        </div>
      </div>
    </div>
  );
};
