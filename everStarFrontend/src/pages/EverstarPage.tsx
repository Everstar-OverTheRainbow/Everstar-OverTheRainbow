import React, { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  useLocation,
  useParams,
  useNavigate,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'store/Store';
import { Header } from 'components/molecules/Header/Header';
import { Footer } from 'components/molecules/Footer/Footer';
import bgImage from 'assets/images/bg-everstar.webp';
import { EverStarMain } from 'components/templates/EverStarMain';
import { EverStarCheerMessage } from 'components/templates/EverStarCheerMessage';
import { EverStarSearchStar } from 'components/templates/EverStarSearchStar';
import { MemorialBook } from 'components/templates/MemorialBook';
import { useMemorialBooks } from 'hooks/useMemorialBooks';

interface PetProfile {
  name: string;
  age: number;
  date: string;
  description: string;
  tagList: string[];
  avatarUrl: string;
}

export const EverstarPage: React.FC = () => {
  const params = useParams<{ pet: string }>();
  const [petProfile, setPetProfile] = useState<PetProfile | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const petId = useSelector((state: RootState) => state.pet.petDetails?.id);

  useEffect(() => {
    const storedPetDetails = sessionStorage.getItem('petDetails');
    const diffPet = sessionStorage.getItem('diffPetDetails');

    if (storedPetDetails) {
      try {
        const petDetails = JSON.parse(storedPetDetails);
        if (Number(petId) === Number(params.pet)) {
          setPetProfile({
            name: petDetails.name || 'Unknown',
            age: petDetails.age || 0,
            date: petDetails.memorialDate || 'Unknown',
            description: petDetails.introduction || 'No description',
            tagList: petDetails.petPersonalities || [],
            avatarUrl: petDetails.profileImageUrl || '',
          });
        }
      } catch (error) {
        console.error('Error parsing pet details:', error);
      }
    }

    if (diffPet) {
      try {
        const diffPetDetails = JSON.parse(diffPet);
        if (Number(petId) !== Number(params.pet)) {
          setPetProfile({
            name: diffPetDetails.name || 'Unknown',
            age: diffPetDetails.age || 0,
            date: diffPetDetails.memorialDate || 'Unknown',
            description: diffPetDetails.introduction || 'No description',
            tagList: diffPetDetails.petPersonalities || [],
            avatarUrl: diffPetDetails.profileImageUrl || '',
          });
        }
      } catch (error) {
        console.error('Error parsing diff pet details:', error);
      }
    }
  }, [location, params.pet, petId]);

  const { data: memorialBooks } = useMemorialBooks(Number(params.pet));

  const handleViewMemorialBook = () => {
    if (memorialBooks && petProfile) {
      const memorialBook = memorialBooks.find(
        (book) => book.isOpen && book.isActive,
      );
      if (memorialBook) {
        navigate(`/everstar/${params.pet}/memorialbook`);
      } else {
        alert('아직 메모리얼북을 열람할 수 없어요');
      }
    }
  };

  return (
    <div
      className='flex flex-col min-h-screen bg-center bg-cover'
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className='flex flex-col min-h-screen'>
        <Header type='everstar' className='top-0 z-50' />
        <div className='flex-grow'>
          <Routes>
            <Route
              path='/'
              element={
                petProfile ? (
                  <EverStarMain
                    title={petProfile.name}
                    fill={49} // 단계 조회 없음 추후 api 추가
                    buttonSize='large'
                    buttonDisabled={false}
                    buttonText='지구별로 이동'
                    onButtonClick={handleViewMemorialBook}
                    buttonTheme='white'
                  />
                ) : (
                  <div>Loading...</div>
                )
              }
            />
            <Route
              path='message'
              element={
                petProfile ? (
                  <EverStarCheerMessage
                    profile={petProfile}
                    postItCards={[]} // Add actual data if available
                    totalPages={0} // Add actual data if available
                  />
                ) : (
                  <div>Loading...</div>
                )
              }
            />
            <Route path='explore' element={<EverStarSearchStar />} />
            <Route path='memorialbook' element={<MemorialBook />} />
          </Routes>
        </div>
        <Footer className='mt-auto' />
      </div>
    </div>
  );
};
