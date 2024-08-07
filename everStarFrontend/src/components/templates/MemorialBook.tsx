import React, { useRef } from 'react';
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
import { useParams, useNavigate } from 'react-router-dom';
import { useMemorialBookById } from 'hooks/useMemorialBooks';
import { MemorialBookData } from 'api/memorialBookApi';
import { useSelector } from 'react-redux';
import { RootState } from 'store/Store';
import { updateMemorialBookOpenStatus } from 'api/memorialBookApi';
import { Toggle } from 'components/atoms/buttons/Toggle';

const parseMemorialBookData = (data: MemorialBookData): PageType[] => {
  const { quests, questAnswers, aiAnswers, diaries, sentimentAnalysis } = data;

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
        petName: data.pet.name,
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
        petName: data.pet.name,
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

export const MemorialBook: React.FC = () => {
  const memorialBookRef = useRef<HTMLDivElement>(null);
  const params = useParams<{ pet: string }>();
  const navigate = useNavigate();
  const petId = Number(params.pet);
  const token = useSelector((state: RootState) => state.auth.accessToken); // Assuming you have token stored in Redux
  const { data: memorialBookResponse } = useMemorialBookById(petId, 1); // 1은 임의의 memorialBookId

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

  const handleToggle = async (status: 'off' | 'on') => {
    if (memorialBookResponse) {
      try {
        await updateMemorialBookOpenStatus(
          petId,
          memorialBookResponse.id,
          status === 'on',
          token || '',
        );
        alert('메모리얼북 공개 상태가 업데이트되었습니다.');
      } catch (error) {
        console.error('Error updating memorial book status:', error);
      }
    }
  };

  const handleWriteDiary = () => {
    navigate(`/everstar/${petId}/memorialbook/diary`);
  };

  const pages = memorialBookResponse
    ? parseMemorialBookData(memorialBookResponse.data)
    : [];

  return (
    <div
      className='relative flex flex-col min-h-screen bg-center bg-cover'
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Header type='everstar' className='sticky top-0 z-50' />
      <Glass
        currentPage={1}
        totalPages={pages.length}
        onPageChange={(newPage) => console.log('Page changed to:', newPage)}
        showPageIndicator={false}
      />
      <div className='relative z-10 my-4' ref={memorialBookRef}>
        <OrganicsMemorialBook pages={pages} />
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
          일기 쓰기
        </PrimaryButton>
      </div>
      {memorialBookResponse && (
        <div className='relative z-10 flex justify-center my-4'>
          <Toggle
            status={memorialBookResponse.isOpen ? 'on' : 'off'}
            onChange={handleToggle}
          />
        </div>
      )}
      <Footer className='relative z-10 mt-auto' />
    </div>
  );
};
