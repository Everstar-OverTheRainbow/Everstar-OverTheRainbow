import type { Meta, StoryObj } from '@storybook/react';
import { MemorialBook, PageType } from './MemorialBook';

const meta: Meta<typeof MemorialBook> = {
  title: 'Organics/MemorialBook',
  component: MemorialBook,
  tags: ['autodocs'],
  argTypes: {
    pages: {
      control: 'object',
    },
    width: { control: 'number' },
    height: { control: 'number' },
    minWidth: { control: 'number' },
    maxWidth: { control: 'number' },
    minHeight: { control: 'number' },
    maxHeight: { control: 'number' },
  },
};

export default meta;

type Story = StoryObj<typeof MemorialBook>;

const pages: PageType[] = [
  { type: 'cover' },
  {
    type: 'chart',
    title: '평가 결과',
    content: '굉장히 많이 호전되었어요.',
    scores: [10, 30, 50, 70, 90, 60, 40],
  },
  {
    type: 'question',
    question: '강아지와 행복했던 순간을 말해주세요.',
    myAnswer: '나의 답변 내용입니다.',
    petName: '반려동물',
    petAnswer: '반려동물의 답변 내용입니다.',
  },
  {
    type: 'imageQuestion',
    question: '그린 그림을 공유해주세요',
    petName: '반려동물',
    myImage: 'https://via.placeholder.com/180x135',
    myAnswer: '이것은 나의 그림입니다.',
    petImage: 'https://via.placeholder.com/180x135',
    petAnswer: '이것은 반려동물의 그림입니다.',
  },
];

export const Default: Story = {
  args: {
    pages,
    width: 360,
    height: 508,
    minWidth: 360,
    maxWidth: 508,
    minHeight: 508,
    maxHeight: 508,
  },
};
