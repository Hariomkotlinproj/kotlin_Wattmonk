package com.example.wattmok.models.LoginModule

data class loginResponse(
    val isotpsent: Boolean,
    val jwt: String,
    val user: User
)