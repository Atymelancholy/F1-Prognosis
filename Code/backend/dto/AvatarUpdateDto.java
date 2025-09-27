// dto/AvatarUpdateDto.java - убедимся в правильности
package com.f1prognosis.backend.dto;

import lombok.Data;

@Data
public class AvatarUpdateDto {
    private String avatar;

    // Добавим конструкторы для надежности
    public AvatarUpdateDto() {}

    public AvatarUpdateDto(String avatar) {
        this.avatar = avatar;
    }
}