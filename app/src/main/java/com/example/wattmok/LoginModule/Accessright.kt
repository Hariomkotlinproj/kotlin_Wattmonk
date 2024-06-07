package com.example.wattmok.LoginModule

data class Accessright(
    val constantname: String,
    val icontype: String,
    val moduleaccess: Boolean,
    val name: String,
    val path: String,
    val viewonly: Boolean,
    val visibility: Boolean
)