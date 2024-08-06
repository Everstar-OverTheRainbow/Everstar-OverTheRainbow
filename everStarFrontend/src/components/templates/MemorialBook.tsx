import React, { useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
  MemorialBook as OrganicsMemorialBook,
  PageType,
} from 'components/organics/MemorialBook/MemorialBook';
import { Header } from 'components/molecules/Header/Header';
import { Footer } from 'components/molecules/Footer/Footer';
import { PrimaryButton } from 'components/atoms/buttons/PrimaryButton';
import { Glass } from 'components/molecules/Glass/Glass';
import bgImage from 'assets/images/bg-everstar.webp';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// JSON 데이터
const jsonData = {
  data: {
    memorialBook: {
      id: 1,
      psychologicalTestResult: null,
      isOpen: false,
      isActive: true,
    },
    pet: {
      id: 1,
      userId: 1,
      name: 'Buddy',
      age: 3,
      memorialDate: '2023-07-24',
      species: 'Dog',
      gender: 'MALE',
      relationship: 'Friend',
      profileImageUrl: 'http://example.com/profile.jpg',
      introduction: 'A friendly dog',
      questIndex: 0,
      lastAccessTime: '2024-07-29T23:32:42.469602',
    },
    sentimentAnalysis: {
      id: 1,
      totalResult: '점점 나아지고 있어요.',
      week1Result: 0.4,
      week2Result: 0.5,
      week3Result: 0.6,
      week4Result: 0.7,
      week5Result: 0.8,
      week6Result: 0.9,
      week7Result: 1,
    },
    quests: [
      {
        id: 1,
        content: 'Quest 1 content',
        type: 'TEXT',
      },
      {
        id: 2,
        content: 'Quest 2 content',
        type: 'TEXT_IMAGE',
      },
      {
        id: 3,
        content: 'Quest 3 content',
        type: 'WEBRTC',
      },
    ],
    questAnswers: [
      {
        petId: 1,
        questId: 1,
        content: 'Quest Answer 1 for pet 1',
        imageUrl: 'http://example.com/image1.jpg',
        type: 'TEXT',
      },
      {
        petId: 1,
        questId: 2,
        content: 'Quest Answer 2 for pet 1',
        imageUrl: 'http://example.com/image2.jpg',
        type: 'TEXT_IMAGE',
      },
      {
        petId: 1,
        questId: 3,
        content: 'Quest Answer 3 for pet 1',
        imageUrl: 'http://example.com/image3.jpg',
        type: 'WEBRTC',
      },
    ],
    aiAnswers: [
      {
        petId: 1,
        questId: 1,
        content: 'AI Answer 1 for pet 1',
        imageUrl: 'http://example.com/ai_image1.jpg',
        type: 'TEXT',
      },
      {
        petId: 1,
        questId: 2,
        content: 'AI Answer 2 for pet 1',
        imageUrl: 'http://example.com/ai_image2.jpg',
        type: 'TEXT_IMAGE',
      },
      {
        petId: 1,
        questId: 3,
        content: 'AI Answer 3 for pet 1',
        imageUrl: 'http://example.com/ai_image3.jpg',
        type: 'MUSIC',
      },
    ],
    diaries: [
      {
        id: 1,
        memorialBookId: 1,
        title: 'Diary Title 1',
        content: 'Diary content 1',
        imageUrl: 'http://example.com/diary_image1.jpg',
        createdTime: '2024-07-29T23:32:49',
      },
      {
        id: 2,
        memorialBookId: 1,
        title: 'Diary Title 2',
        content: 'Diary content 2',
        imageUrl: 'http://example.com/diary_image2.jpg',
        createdTime: '2024-07-29T23:32:49',
      },
      {
        id: 3,
        memorialBookId: 1,
        title: 'Diary Title 3',
        content: 'Diary content 3',
        imageUrl: 'http://example.com/diary_image3.jpg',
        createdTime: '2024-07-29T23:32:49',
      },
    ],
  },
};

// JSON 데이터를 MemorialBook의 PageType 배열로 변환하는 함수
const parseMemorialBookData = (data: typeof jsonData) => {
  const { quests, questAnswers, aiAnswers, diaries, sentimentAnalysis } =
    data.data;

  const pages: PageType[] = [];

  // Cover 페이지 추가
  pages.push({
    type: 'cover',
  });
  // Sentiment Analysis 차트 페이지 추가
  const sentimentResults = [
    sentimentAnalysis.week1Result * 100,
    sentimentAnalysis.week2Result * 100,
    sentimentAnalysis.week3Result * 100,
    sentimentAnalysis.week4Result * 100,
    sentimentAnalysis.week5Result * 100,
    sentimentAnalysis.week6Result * 100,
    sentimentAnalysis.week7Result * 100,
  ];

  pages.push({
    type: 'chart',
    title: '감정 분석',
    content: sentimentAnalysis.totalResult,
    scores: sentimentResults,
  });

  // Quest Pages 추가
  quests.forEach((quest) => {
    const questAnswer = questAnswers.find(
      (answer) => answer.questId === quest.id,
    );
    const aiAnswer = aiAnswers.find((answer) => answer.questId === quest.id);

    if (quest.type === 'TEXT' && questAnswer && aiAnswer) {
      pages.push({
        type: 'question',
        question: quest.content,
        myAnswer: questAnswer.content,
        petName: data.data.pet.name,
        petAnswer: aiAnswer.content,
      });
    } else if (
      (quest.type === 'TEXT_IMAGE' || quest.type === 'WEBRTC') &&
      questAnswer &&
      aiAnswer
    ) {
      pages.push({
        type: 'imageQuestion',
        question: quest.content,
        petName: data.data.pet.name,
        myImage: questAnswer.imageUrl,
        myAnswer: questAnswer.content,
        petImage: aiAnswer.imageUrl,
        petAnswer: aiAnswer.content,
      });
    }
  });

  // Diary Pages 추가
  diaries.forEach((diary) => {
    pages.push({
      type: 'diary',
      title: diary.title,
      content: diary.content,
      imageUrl: diary.imageUrl,
    });
  });

  return pages;
};

const questionsAndAnswers = parseMemorialBookData(jsonData);

export const MemorialBook: React.FC = () => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const isMobile = useMediaQuery({ query: '(max-width: 480px)' });

  const headerType = isMobile
    ? 'mobile-everstar'
    : isTabletOrMobile
      ? 'tablet-everstar'
      : 'everstar';

  const memorialBookRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    if (memorialBookRef.current) {
      const book = memorialBookRef.current.querySelectorAll('.demoPage');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });

      for (let i = 0; i < book.length; i++) {
        const page = book[i] as HTMLElement;
        page.style.display = 'block';
        const canvas = await html2canvas(page, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        if (i < book.length - 1) {
          pdf.addPage();
        }
        page.style.display = 'none';
      }
      pdf.save('memorial-book.pdf');
    }
  };

  const handleWriteDiary = () => {
    console.log('일기 작성');
  };

  return (
    <div
      className='relative flex flex-col min-h-screen bg-center bg-cover'
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Header type={headerType} className='sticky top-0 z-50' />
      <Glass
        variant={isMobile ? 'mobile' : isTabletOrMobile ? 'tablet' : 'desktop'}
        currentPage={1}
        totalPages={questionsAndAnswers.length}
        onPageChange={(newPage) => console.log('Page changed to:', newPage)}
        showPageIndicator={false}
      />
      <div className='relative z-10 my-4' ref={memorialBookRef}>
        <OrganicsMemorialBook pages={questionsAndAnswers} />
      </div>
      <div className='relative z-10 flex justify-center my-4 space-x-4'>
        <PrimaryButton
          theme='white'
          size='medium'
          onClick={handleDownloadPdf}
          disabled={false}
          icon={null}
        >
          PDF로 만들기
        </PrimaryButton>
        <PrimaryButton
          theme='white'
          size='medium'
          onClick={handleWriteDiary}
          disabled={false}
          icon={null}
        >
          일기 작성
        </PrimaryButton>
      </div>
      <Footer />
    </div>
  );
};
