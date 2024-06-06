package com.example.wattmok.networkmodule

import com.example.wattmok.Api.LoginApi
import com.example.wattmok.Utils.Constants
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import javax.inject.Singleton

@InstallIn(SingletonComponent:: class)
@Module
class NetworkModule {
    @Singleton
    fun  providesRetorfit():Retrofit{
        return Retrofit.Builder()
            .addConverterFactory(GsonConverterFactory.create())
            .baseUrl(Constants.BASE_URL)
            .build()
    }
@Singleton
@Provides
    fun  prividesLoginApi(retrofit: Retrofit): LoginApi{
        return  retrofit.create(LoginApi::class.java)
    }
}