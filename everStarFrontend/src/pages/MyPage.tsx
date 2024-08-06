// src/components/templates/MyPage.tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Header } from 'components/molecules/Header/Header';
import { Footer } from 'components/molecules/Footer/Footer';
import { Glass } from 'components/molecules/Glass/Glass';
import { MyinfoMove } from 'components/templates/MyInfoMove';
import { Profile } from 'components/templates/Profile';
import { MyInfo } from 'components/templates/MyInfo';
import { useMediaQuery } from 'react-responsive';
import bgImage from 'assets/images/bg-login.webp';

export const MyPage: React.FC = () => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const isMobile = useMediaQuery({ query: '(max-width: 480px)' });

  const headerType = isMobile
    ? 'mobile-mypage'
    : isTabletOrMobile
      ? 'tablet-mypage'
      : 'mypage';
  const footerType = isMobile
    ? 'mobile'
    : isTabletOrMobile
      ? 'tablet'
      : 'desktop';

  return (
    <div
      className='relative flex flex-col min-h-screen bg-center bg-cover'
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Header type={headerType} className='sticky top-0 z-50' />
      <Glass
        variant={isMobile ? 'mobile' : isTabletOrMobile ? 'tablet' : 'desktop'}
        currentPage={1}
        totalPages={1}
        onPageChange={(newPage) => console.log('Page changed to:', newPage)}
        showPageIndicator={false}
      />
      <div className='relative z-10 flex flex-grow items-center justify-center my-4'>
        <Routes>
          <Route path='/' element={<MyinfoMove />} />
          <Route path='profile' element={<Profile />} />
          <Route path='myinfo' element={<MyInfo />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};
