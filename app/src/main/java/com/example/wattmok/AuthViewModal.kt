package com.example.wattmok

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.wattmok.LoginModule.LoginRequest
import com.example.wattmok.repository.LoginRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AuthViewModal @Inject constructor (private  val userRepository: LoginRepository) :ViewModel() {

    fun loginUser(userRequest: LoginRequest){
        viewModelScope.launch {
            userRepository.loginUser(userRequest)
        }
    }

}