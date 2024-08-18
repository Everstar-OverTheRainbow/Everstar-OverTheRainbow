import React, { useState, useEffect, useRef } from 'react';
import {
  useFetchMemorialBooks,
  useUpdateMemorialBookOpenStatus,
} from 'hooks/useMemorialBooks';
import { DepressionSurvey } from 'components/organics/DepressionSurvey/DepressionSurvey';
import { MainActionComponent } from 'components/organics/MainActionComponent/MainActionComponent';
import { ProfileModal } from 'components/organics/ProfileModal/ProfileModal';
import { IntroduceWrite } from 'components/organics/CheerMessage/IntroduceWrite';
import { useSound } from 'use-sound';
import { RootState } from 'store/Store';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import introduce from 'assets/musics/Introduce.mp3';
import myEverStar from 'assets/musics/MyEverStar.mp3';
import diffEverStar from 'assets/musics/DiffEverStar.mp3';
import Swal from 'sweetalert2';

interface EverStarMainProps {
  petProfile: {
    name: string;
    age: number;
    date: string;
    description: string;
    tagList: string[];
    avatarUrl: string;
    questIndex: number;
  } | null;
  buttonDisabled: boolean;
  memorialBookProfile: {
    id: number;
    psychologicalTestResult: string | null;
    isOpen: boolean;
    isActive: boolean;
  } | null;
  petId: number;
  isOwner: boolean;
}

export const EverStarMain: React.FC<EverStarMainProps> = ({
  petProfile,
  memorialBookProfile,
  petId,
  isOwner,
}) => {
  const params = useParams();
  const myPetId = useSelector((state: RootState) => state.pet.petDetails?.id);
  const [MyEverStar] = useSound(myEverStar);
  const [DiffEverStar] = useSound(diffEverStar);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // 처음 렌더링 시 아무 동작도 하지 않음
    }

    if (!isProfileModalOpen) {
      if (Number(myPetId) === Number(params.pet)) {
        MyEverStar();
      } else {
        DiffEverStar();
      }
    }
    isFirstRender.current = true;
  });
  // useEffect(() => {
  //   if (!isProfileModalOpen) {
  //     if (Number(myPetId) === Number(params.pet)) {
  //       MyEverStar();
  //     } else {
  //       DiffEverStar();
  //     }
  //   }
  // }, []);
  const [Introduce] = useSound(introduce);
  const { data, refetch } = useFetchMemorialBooks(petId); // Fetch memorial book profile
  const [toggleStatus, setToggleStatus] = useState<'on' | 'off' | undefined>(
    () => {
      // 오늘 날짜: 2024-08-18
      const savedStatus = localStorage.getItem(`toggleStatus-${petId}`);
      return savedStatus
        ? (savedStatus as 'on' | 'off')
        : memorialBookProfile?.isOpen
          ? 'on'
          : 'off';
    }
  );
  const [isModalOpen, setIsModalOpen] = useState(
    petProfile?.questIndex === 50 && !memorialBookProfile?.isActive && isOwner
  );

  const petIntroduce = JSON.parse(sessionStorage.getItem('petDetails') || '{}');

  const [isIntroduceWriteModalOpen, setIntroduceWriteModalOpen] =
    useState(false);

  const { mutate: updateMemorialBookStatus } = useUpdateMemorialBookOpenStatus({
    onSuccess: () => {
      // refetch();
      // 상태 업데이트 성공 시 로컬 저장소를 업데이트하고 refetch를 제거합니다.
      // localStorage.setItem(`toggleStatus-${petId}`, toggleStatus); // 오늘 날짜: 2024-08-18
    },
    onError: () => {
      // 상태 업데이트 실패 시 원래 토글 상태로 복원
      setToggleStatus((prevStatus) => {
        localStorage.setItem(`toggleStatus-${petId}`, prevStatus || 'off');
        return prevStatus;
      });
    },
  });
  // const [description, setDescription] = useState(petProfile?.description || '');

  // const handleVerifyIntroduceWrite = () => {
  //   setIntroduceWriteModalOpen(false);
  // };

  const handleSurveySubmitSuccess = async () => {
    // 설문 제출 후 모달 닫기
    setIsModalOpen(false);
    // memorialBookProfile 다시 가져오기
    await refetch();
    // 최신 데이터 가져오기
    const updatedMemorialBookProfile = data?.data || memorialBookProfile;

    // isActive를 true로 설정
    if (updatedMemorialBookProfile && !updatedMemorialBookProfile.isActive) {
      updateMemorialBookStatus({
        petId,
        memorialBookId: updatedMemorialBookProfile.id,
        isOpen: updatedMemorialBookProfile.isOpen,
      });
    }
    if (updatedMemorialBookProfile?.psychologicalTestResult === null) {
      updatedMemorialBookProfile.psychologicalTestResult = '.';
    }

    // 심리 테스트 결과를 알림으로 표시
    if (updatedMemorialBookProfile?.psychologicalTestResult) {
      Swal.fire({
        icon: 'success',
        title: '트라우마 자가진단',
        // text: updatedMemorialBookProfile.psychologicalTestResult,
        text: '일상생활의 지장을 초래할만한 우울 관련 증상이 거의 보이지 않았습니다.',
        confirmButtonColor: '#FF9078',
      });
    }
  };

  const handleProfileClick = () => {
    Introduce();
    setIsProfileModalOpen(true); // 프로필 클릭 시 모달 열기
  };

  useEffect(() => {
    // refetch();
    // 컴포넌트 마운트 시 memorialBookProfile 가져오기
    // refetch(); // 오늘 날짜: 2024-08-18
    // Fetch memorial book profile data (commented out)
  }, [data]);

  useEffect(() => {
    // isActive가 true일 때 설문 모달이 다시 뜨지 않도록 설정
    if (memorialBookProfile?.isActive) {
      setIsModalOpen(false);
    }
  }, [memorialBookProfile]);

  const handleCloseIntroduceWriteModal = () => {
    setIntroduceWriteModalOpen(false);
    const petIntroduce = JSON.parse(
      sessionStorage.getItem('petDetails') || '{}'
    );
    if (petProfile) {
      petProfile.description = petIntroduce.introduction;
    }
  };
  if (!petProfile) {
    return <div>Loading...</div>;
  }

  const updatedMemorialBookProfile = data?.data || memorialBookProfile;

  return (
    <div className='flex justify-center flex-grow'>
      {isModalOpen &&
        updatedMemorialBookProfile &&
        petProfile?.questIndex === 50 &&
        isOwner &&
        !updatedMemorialBookProfile.isActive && (
          <div style={{ position: 'relative', zIndex: 1000 }}>
            <DepressionSurvey
              onSubmitSuccess={handleSurveySubmitSuccess}
              memorialBookId={updatedMemorialBookProfile.id} // memorialBookId를 직접 전달
            />
          </div>
        )}

      <MainActionComponent
        type='everstar'
        profileImageUrl={petProfile.avatarUrl}
        fill={petProfile.questIndex}
        name={petProfile.name}
        age={petProfile.age}
        description={petIntroduce.introduction}
        memorialBookProfile={updatedMemorialBookProfile}
        toggleStatus={toggleStatus}
        onToggleChange={(status) => {
          setToggleStatus(status);
          localStorage.setItem(`toggleStatus-${petId}`, status); // 오늘 날짜: 2024-08-18
          if (updatedMemorialBookProfile) {
            updateMemorialBookStatus({
              petId,
              memorialBookId: updatedMemorialBookProfile.id,
              isOpen: status === 'on',
            });
          }
        }}
        isOwner={isOwner}
        onProfileClick={handleProfileClick} // 프로필 클릭 핸들러 추가
      />

      <IntroduceWrite
        isOpen={isIntroduceWriteModalOpen}
        onClose={handleCloseIntroduceWriteModal}
        text='소개글을 입력하세요'
        onResend={() => {}}
      />

      <ProfileModal
        avatarSrc={petProfile.avatarUrl}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)} // 프로필 모달 닫기
        profileData={petProfile}
        isOwner={isOwner}
        onPencilClick={() => {
          setIntroduceWriteModalOpen(true);
          setIsProfileModalOpen(false);
        }}
      />
    </div>
  );
};
