package com.everstarbackmain.domain.everstar.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.everstarbackmain.domain.everstar.responsedto.EverStarPetInfoResponseDto;
import com.everstarbackmain.domain.everstar.service.EverStarService;
import com.everstarbackmain.global.util.HttpResponseUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/everstar")
@Slf4j(topic = "elk")
public class EverStarController {

	private final EverStarService everStarService;
	private final HttpResponseUtil responseUtil;

	@GetMapping("/pets/{pet-id}")
	public ResponseEntity<Map<String, Object>> getEverStar(@PathVariable Long petId) {
		EverStarPetInfoResponseDto responseDto = everStarService.getEverStarPetInfo(petId);
		ResponseEntity<Map<String, Object>> response = responseUtil.createResponse(responseDto);
		log.info("main - sever : getEverStarPetInfo: {}", responseDto);
		return response;
	}
}
