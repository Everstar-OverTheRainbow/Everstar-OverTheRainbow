package com.everstarbackmain.domain.cheeringMessage.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.BDDMockito;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import com.everstarbackmain.domain.cheeringMessage.model.CheeringMessage;
import com.everstarbackmain.domain.cheeringMessage.model.Color;
import com.everstarbackmain.domain.cheeringMessage.repository.CheeringMessageRepository;
import com.everstarbackmain.domain.cheeringMessage.requestDto.CreateCheeringMessageRequestDto;
import com.everstarbackmain.domain.pet.model.Pet;
import com.everstarbackmain.domain.pet.model.PetGender;
import com.everstarbackmain.domain.pet.repository.PetRepository;
import com.everstarbackmain.domain.pet.requestdto.CreatePetRequestDto;
import com.everstarbackmain.domain.user.model.Gender;
import com.everstarbackmain.domain.user.model.Role;
import com.everstarbackmain.domain.user.model.User;
import com.everstarbackmain.domain.user.requestDto.JoinRequestDto;
import com.everstarbackmain.global.exception.CustomException;
import com.everstarbackmain.global.exception.ExceptionResponse;
import com.everstarbackmain.global.security.auth.PrincipalDetails;

@ExtendWith(MockitoExtension.class)
public class DeleteCheeringMessageServiceTest {

	@InjectMocks
	private CheeringMessageService cheeringMessageService;

	@Mock
	private CheeringMessageRepository cheeringMessageRepository;

	@Mock
	private PetRepository petRepository;

	@Mock
	private Authentication authentication;

	@Mock
	private PrincipalDetails principalDetails;

	private User user;
	private Pet pet;
	private CreateCheeringMessageRequestDto requestDto;
	private CheeringMessage cheeringMessage;

	@BeforeEach
	public void setUp() {
		user = User.signUpUser(new JoinRequestDto("email", "password", "name", "010-1111-1111", LocalDate.now(),
			Gender.MALE, LocalTime.now(), Role.ROLE_USER));

		pet = Pet.createPet(user, new CreatePetRequestDto("petName", 10,
			LocalDate.of(1990, 1, 1), "species", PetGender.MALE,
			"relationship", List.of("개구쟁이", "귀염둥이")), "img");

		requestDto = new CreateCheeringMessageRequestDto("content", Color.BLUE, false);
		cheeringMessage = CheeringMessage.createAnonymousCheeringMessage(requestDto, pet);
	}

	@Test
	@DisplayName("응원메시지 삭제 성공 테스트")
	public void 응원메시지_삭제_성공_테스트() {
		//given
		BDDMockito.given(authentication.getPrincipal()).willReturn(principalDetails);
		BDDMockito.given(principalDetails.getUser()).willReturn(user);
		BDDMockito.given(petRepository.findByIdAndUserAndIsDeleted(1L, user, false)).willReturn(Optional.of(pet));
		BDDMockito.given(cheeringMessageRepository.findCheeringMessageByIdAndPetAndIsDeleted(1L, pet, false))
			.willReturn(Optional.of(cheeringMessage));

		//when then
		Assertions.assertThatNoException()
			.isThrownBy(() -> cheeringMessageService.deleteCheeringMessage(authentication, 1L, 1L));
	}

	@Test
	@DisplayName("응원메시지 삭제 실패 펫 존재하지 않음 테스트")
	public void 응원메시지_삭제_펫_존재하지_않음_실패_테스트() {
		//given
		BDDMockito.given(authentication.getPrincipal()).willReturn(principalDetails);
		BDDMockito.given(principalDetails.getUser()).willReturn(user);

		//when then
		Assertions.assertThatThrownBy(() -> cheeringMessageService.deleteCheeringMessage(authentication, 1L, 1L))
			.isInstanceOf(ExceptionResponse.class)
			.hasFieldOrPropertyWithValue("customException", CustomException.NOT_FOUND_PET_EXCEPTION);
	}

	@Test
	@DisplayName("응원메시지 삭제 실패 응원메시지 존재하지 않음 테스트")
	public void 응원메시지_삭제_응원메시지_존재하지_않음_실패_테스트() {
		//given
		BDDMockito.given(authentication.getPrincipal()).willReturn(principalDetails);
		BDDMockito.given(principalDetails.getUser()).willReturn(user);
		BDDMockito.given(petRepository.findByIdAndUserAndIsDeleted(1L, user, false)).willReturn(Optional.of(pet));

		//when then
		Assertions.assertThatThrownBy(() -> cheeringMessageService.deleteCheeringMessage(authentication, 1L, 1L))
			.isInstanceOf(ExceptionResponse.class)
			.hasFieldOrPropertyWithValue("customException", CustomException.NOT_FOUND_CHEERING_MESSAGE_EXCEPTION);
	}
}