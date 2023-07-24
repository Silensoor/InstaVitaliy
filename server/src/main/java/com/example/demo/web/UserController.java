package com.example.demo.web;

import com.example.demo.dto.UserDTO;
import com.example.demo.entity.User;
import com.example.demo.facade.UserFacade;
import com.example.demo.service.UserService;
import com.example.demo.validations.ResponseErrorValidation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ObjectUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
@CrossOrigin
public class UserController {

    private final UserService userService;
    private final UserFacade userFacade;
    private final ResponseErrorValidation errorValidation;

    @GetMapping("/")
    public ResponseEntity<UserDTO> getCurrentUser(Principal principal) {
        User user = userService.getCurrentUser(principal);
        UserDTO userDTO = userFacade.userToUserDTO(user);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUserProfile(@PathVariable("userId") String userId) {
        User user = userService.getUserById(Long.parseLong(userId));
        UserDTO userDTO = userFacade.userToUserDTO(user);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }
    @PostMapping("/update")
    public ResponseEntity<Object> updateUser(@Valid @RequestBody UserDTO userDTO,
                                             BindingResult bindingResult, Principal principal) {
        ResponseEntity<Object> objectResponseEntity = errorValidation.mapValidationService(bindingResult);
        if (!ObjectUtils.isEmpty(objectResponseEntity)) return objectResponseEntity;
        User user = userService.updateUser(userDTO, principal);
        UserDTO userDTO1 = userFacade.userToUserDTO(user);
        return new ResponseEntity<>(userDTO1, HttpStatus.OK);
    }


}
