package com.everstarbackmain.domain.petterLetter.responseDto;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.ConstructorExpression;
import javax.annotation.processing.Generated;

/**
 * com.everstarbackmain.domain.petterLetter.responseDto.QPetLetterResponseDto is a Querydsl Projection type for PetLetterResponseDto
 */
@Generated("com.querydsl.codegen.DefaultProjectionSerializer")
public class QPetLetterResponseDto extends ConstructorExpression<PetLetterResponseDto> {

    private static final long serialVersionUID = 744628662L;

    public QPetLetterResponseDto(com.querydsl.core.types.Expression<Long> id, com.querydsl.core.types.Expression<Boolean> isRead, com.querydsl.core.types.Expression<String> petName, com.querydsl.core.types.Expression<String> content, com.querydsl.core.types.Expression<java.time.LocalDateTime> createAt) {
        super(PetLetterResponseDto.class, new Class<?>[]{long.class, boolean.class, String.class, String.class, java.time.LocalDateTime.class}, id, isRead, petName, content, createAt);
    }

}
