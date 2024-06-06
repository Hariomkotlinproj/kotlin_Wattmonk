package com.example.wattmok.models.LoginModule

data class Accessright(
    val constantname: String,
    val icontype: String,
    val moduleaccess: Boolean,
    val name: String,
    val path: String,
    val viewonly: Boolean,
    val visibility: Boolean
)