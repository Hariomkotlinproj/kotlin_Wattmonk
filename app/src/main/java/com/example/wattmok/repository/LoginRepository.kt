package com.example.wattmok.repository

import android.util.Log
import com.example.wattmok.LoginModule.LoginRequest
import com.example.wattmok.Utils.Constants.TAG
import com.example.wattmok.api.LoginApi
import javax.inject.Inject


class LoginRepository @Inject constructor(private  val loginApi:LoginApi) {
suspend fun loginUser(loginRequest: LoginRequest){
    val  response  =loginApi.login(loginRequest)
    val responseBody = response.body()
    if (responseBody != null) {
        Log.d(TAG, responseBody.toString())
    } else {
        Log.d(TAG, "Response body is null")
    }

//    Log.d(TAG,response.body().toString())
//    Log.d(TAG,"Api response")
}
}