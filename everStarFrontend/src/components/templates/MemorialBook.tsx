import React, { useRef, useState, useEffect } from 'react';
import {
  MemorialBook as OrganicsMemorialBook,
  PageType,
} from 'components/organics/MemorialBook/MemorialBook';
import { PrimaryButton } from 'components/atoms/buttons/PrimaryButton';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MemorialBookDetailsResponse } from 'api/memorialBookApi';
import { useFetchMemorialBookById } from 'hooks/useMemorialBooks';
import { useParams } from 'react-router-dom';
import { MemorialBookDiaryModal } from 'components/organics/MemorialBook/MemorialBookDiaryModal';
import bgImage from 'assets/images/bg-login.webp';
import { SplashTemplate } from './SplashTemplate';

const toBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url, {
    mode: 'cors', // CORS 문제를 해결하기 위한 설정
  });

  if (!response.ok) {
    throw new Error('Failed to fetch image');
  }

  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const parseMemorialBookData = async (
  data: MemorialBookDetailsResponse,
  avatarUrl: string | undefined,
): Promise<PageType[]> => {
  const { quests, questAnswers, aiAnswers, diaries, sentimentAnalysis, pet } =
    data;
  const pages: PageType[] = [];

  if (avatarUrl) {
    const base64Avatar = await toBase64(avatarUrl);
    pages.push({
      type: 'cover',
      src: base64Avatar,
    });
  }

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

  for (const quest of quests) {
    const questAnswer = questAnswers.find(
      (answer) => answer.questId === quest.id,
    );
    const aiAnswer = aiAnswers.find((answer) => answer.questId === quest.id);

    if (quest.type === 'TEXT' && questAnswer && aiAnswer) {
      pages.push({
        type: 'question',
        question: quest.content,
        myAnswer: questAnswer.content,
        petName: pet.name,
        petAnswer: aiAnswer.content,
      });
    } else if (
      (quest.type === 'TEXT_IMAGE' || quest.type === 'WEBRTC') &&
      questAnswer &&
      aiAnswer
    ) {
      const myImageBase64 = await toBase64(questAnswer.imageUrl);
      const petImageBase64 = await toBase64(aiAnswer.imageUrl);

      pages.push({
        type: 'imageQuestion',
        question: quest.content,
        petName: pet.name,
        myImage: myImageBase64,
        myAnswer: questAnswer.content,
        petImage: petImageBase64,
        petAnswer: aiAnswer.content,
      });
    }
  }

  for (const diary of diaries) {
    const imageBase64 = diary.imageUrl ? await toBase64(diary.imageUrl) : '';

    pages.push({
      type: 'diary',
      title: diary.title,
      content: diary.content,
      imageUrl: imageBase64,
    });
  }

  return pages;
};

const loadImages = (element: HTMLElement) => {
  const images = element.querySelectorAll('img');
  const promises = Array.from(images).map((img) => {
    return new Promise<void>((resolve, reject) => {
      if (img.complete) {
        resolve();
      } else {
        img.onload = () => resolve();
        img.onerror = () => reject();
      }
    });
  });
  return Promise.all(promises);
};

export const MemorialBook: React.FC<{ avatarUrl?: string }> = ({
  avatarUrl,
}) => {
  const params = useParams<{ pet?: string; memorialBookId?: string }>();
  const petId = params.pet ? parseInt(params.pet, 10) : 0;
  const memorialBookId = params.memorialBookId
    ? parseInt(params.memorialBookId, 10)
    : 0;

  const memorialBookRef = useRef<HTMLDivElement>(null);

  const {
    data: memorialBookDetails,
    isLoading,
    refetch,
  } = useFetchMemorialBookById(petId, memorialBookId);

  const [pages, setPages] = useState<PageType[]>([]);
  const [isDiaryModalOpen, setIsDiaryModalOpen] = useState(false);
  const [isDiaryUpdated, setIsDiaryUpdated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (memorialBookDetails) {
        const parsedPages = await parseMemorialBookData(
          memorialBookDetails.data,
          avatarUrl,
        );
        setPages(parsedPages);
      }
    };

    fetchData();
  }, [memorialBookDetails, avatarUrl]);

  useEffect(() => {
    if (isDiaryUpdated) {
      refetch();
      alert('저장이 완료되었어요.');
      setIsDiaryUpdated(false);
    }
  }, [isDiaryUpdated, refetch]);

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
        await loadImages(page);
        page.style.display = 'block';

        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          logging: true,
        });

        const imgData = canvas.toDataURL('image/png', 1.0);
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
    setIsDiaryModalOpen(true);
  };

  const handleCloseDiaryModal = () => {
    setIsDiaryModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className='relative flex flex-col items-center justify-center min-h-screen bg-center bg-cover z-[-1]'>
        <img
          src={bgImage}
          alt='Background'
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <SplashTemplate type='book' className='z-10 w-full h-full ' />
      </div>
    );
  }
  return (
    <div>
      <div className='relative z-10 my-4' ref={memorialBookRef}>
        <OrganicsMemorialBook pages={pages} />
      </div>
      <div className='relative z-10 flex justify-center m-4 space-x-4'>
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
          일기쓰기
        </PrimaryButton>
      </div>

      <MemorialBookDiaryModal
        isOpen={isDiaryModalOpen}
        onClose={handleCloseDiaryModal}
        onSuccess={() => setIsDiaryUpdated(true)}
      />
    </div>
  );
};
