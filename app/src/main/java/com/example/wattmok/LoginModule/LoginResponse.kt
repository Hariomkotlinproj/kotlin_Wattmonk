package com.example.wattmok.LoginModule

data class LoginResponse(
    val isotpsent: Boolean,
    val jwt: String,
    val user: User
)