package com.example.wattmok.models.Login

data class Accessrights(
    val accessrights: List<Accessright>,
    val createdAt: String,
    val id: Int,
    val pdfautogeneration: Boolean,
    val roleid: String,
    val updatedAt: String,
    val userid: String
)