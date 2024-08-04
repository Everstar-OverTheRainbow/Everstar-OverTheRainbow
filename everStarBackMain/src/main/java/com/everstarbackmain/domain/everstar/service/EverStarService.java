package com.everstarbackmain.domain.everstar.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.everstarbackmain.domain.everstar.responsedto.EverStarPetInfoResponseDto;
import com.everstarbackmain.domain.pet.model.Pet;
import com.everstarbackmain.domain.pet.repository.PetRepository;
import com.everstarbackmain.global.exception.CustomException;
import com.everstarbackmain.global.exception.ExceptionResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j(topic = "elk")
public class EverStarService {

	private final PetRepository petRepository;

	public EverStarPetInfoResponseDto getEverStarPetInfo(Long petId) {
		List<String> petPersonalities = petRepository.findPetPersonalitiesById(petId);

		Pet pet = petRepository.findByIdAndIsDeleted(petId, false)
			.orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_PET_EXCEPTION));

		return EverStarPetInfoResponseDto.createEverStarPetInfoResponseDto(pet, petPersonalities);
	}

}
