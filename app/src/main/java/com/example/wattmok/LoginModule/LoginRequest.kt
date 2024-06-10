package com.example.wattmok.LoginModule

data class LoginRequest(
    val identifier: String,
    val password: String,
    val platform: String
)