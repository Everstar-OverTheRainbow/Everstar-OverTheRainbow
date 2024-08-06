import React from 'react';
import {
  ArrowIcon,
  ArrowIconProps,
} from 'components/atoms/icons/Arrow/ArrowIcon';
import { Lable } from 'components/atoms/texts/Lable';

type PrimaryButtonTheme = 'focus' | 'hover' | 'white';
type PrimaryButtonSize = 'large' | 'medium' | 'small';

interface IPrimaryButtonProps {
  theme: PrimaryButtonTheme;
  size: PrimaryButtonSize;
  disabled: boolean;
  children?: string; // Optional children prop
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  icon?: React.ReactElement | null;
  hug?: boolean;
  label?: string; // Optional label prop
  showLabelStar?: boolean; // Optional prop to show or hide star in label
}

const focus = 'bg-mainprimary text-greyscalewhite hover:bg-bgorange';
const white = 'bg-white text-mainsecondary hover:bg-bgorange';
const hover = 'bg-bgorange text-mainsecondary hover:bg-mainprimary';
const disabledStyle =
  'disabled:bg-greyscaleblack-20 disabled:text-greyscaleblack-60';
const shadowStyle = 'shadow-[0px_4px_8px_#dbe5ec99,0px_0px_1px_1px_#dbe5ec99]';

const color: Record<PrimaryButtonTheme, string> = {
  focus,
  white,
  hover,
};

const large = 'w-[320px] h-[64px]';
const medium = 'w-[134px] h-[48px]';
const small = 'w-[106px] h-[40px]';

const sizeStyle: Record<PrimaryButtonSize, string> = {
  large,
  medium,
  small,
};

export function PrimaryButton({
  theme,
  size,
  children = '',
  onClick,
  disabled,
  icon = <ArrowIcon color='black' direction='right' size={24} />,
  hug = false,
  label, // 추가된 라벨 prop
  showLabelStar = false, // Optional prop to show or hide star in label
}: IPrimaryButtonProps) {
  const getTextStyle = () => {
    switch (size) {
      case 'large':
        return 'kor-h-h3';
      case 'medium':
        return 'kor-subtitle-subtitle2';
      case 'small':
        return 'kor-p-p4';
      default:
        return '';
    }
  };

  const getButtonClasses = () => {
    let classes = `
      flex
      items-center
      justify-between
      rounded-lg
      px-4
      ${disabledStyle}
      ${shadowStyle}
      ${color[theme]}
    `;
    if (hug) {
      classes += ` w-auto ${sizeStyle[size].split(' ')[1]}`; // 높이는 고정, 너비는 auto
    } else {
      classes += ` ${sizeStyle[size]}`;
    }
    return classes;
  };

  const iconColor = disabled ? 'gray' : theme === 'focus' ? 'white' : 'black';
  const renderIcon = () => {
    if (React.isValidElement(icon) && icon.type === ArrowIcon) {
      return React.cloneElement(icon, { color: iconColor } as ArrowIconProps);
    }
    return icon;
  };

  return (
    <div className='flex flex-col items-start'>
      {label && (
        <Lable
          prop={label}
          show={showLabelStar}
          font='default'
          className='mb-1 text-left'
        />
      )}
      <button
        className={`${getButtonClasses()} group`}
        disabled={disabled}
        onClick={onClick}
      >
        <span className={`flex-grow mx-auto text-center ${getTextStyle()}`}>
          {children}
        </span>
        {icon && <span className='ml-auto'>{renderIcon()}</span>}
      </button>
    </div>
  );
}