import { ReactComponent as BookCoverSVG } from 'assets/images/book-cover.svg';

export const AtomBookcover = () => {
  return (
    <div className='relative w-[360px] h-[600px]'>
      <BookCoverSVG className='w-full h-full' />
    </div>
  );
};