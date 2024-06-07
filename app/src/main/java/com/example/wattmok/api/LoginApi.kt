package com.example.wattmok.api

import com.example.wattmok.LoginModule.LoginRequest
import com.example.wattmok.LoginModule.LoginResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface LoginApi {
    @POST("auth/local")
    suspend fun login(@Body userRequest: LoginRequest):Response<LoginResponse>
}