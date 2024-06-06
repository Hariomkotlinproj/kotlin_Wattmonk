package com.example.wattmok.Api

import com.example.wattmok.models.LoginModule.LoginRequest
import com.example.wattmok.models.LoginModule.loginResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface LoginApi {
@POST("auth/local")
    suspend fun loginResponse(@Body userRequest: LoginRequest) : Response<loginResponse>
}