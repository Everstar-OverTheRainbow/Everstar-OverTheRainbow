package com.everstarbackmain.domain.everstar.responsedto;

import java.time.LocalDate;
import java.util.List;

import com.everstarbackmain.domain.pet.model.Pet;
import com.everstarbackmain.domain.pet.responsedto.MyPagePetInfoResponseDto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class EverStarPetInfoResponseDto {

	private Long userId;
	private Long id;
	private String profileImageUrl;
	private String name;
	private String introduction;
	private Integer age;
	private LocalDate memorialDate;
	private List<String> petPersonalities; //MypageDto? or service에서 List<String>

	// 인자로 들어간 성격 리스트가 MyPagePetInfoResponseDto에 있느는데 그걸 가져와도 되는건지?
	public static EverStarPetInfoResponseDto createEverStarPetInfoResponseDto(Pet pet, List<String> petPersonalities) {
		return EverStarPetInfoResponseDto.builder()
			.userId(pet.getUser().getId())
			.id(pet.getId())
			.profileImageUrl(pet.getProfileImageUrl())
			.name(pet.getName())
			.introduction(pet.getIntroduction())
			.age(pet.getAge())
			.memorialDate(pet.getMemorialDate())
			.petPersonalities(petPersonalities)
			.build();
	}
}
