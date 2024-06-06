package com.example.wattmok.models.Login

data class loginResponse(
    val isotpsent: Boolean,
    val jwt: String,
    val user: User
)