package com.example.wattmok.NetworkModule

import com.example.wattmok.Utils.Constants
import com.example.wattmok.api.LoginApi
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

import javax.inject.Singleton

@InstallIn(SingletonComponent:: class)
@Module
class network {
@Singleton
@Provides
    fun providesRetrofit(): Retrofit{
        return  Retrofit.Builder()
            .addConverterFactory(GsonConverterFactory.create())
            .baseUrl(Constants.BASE_URL)
            .build()
    }
@Singleton
@Provides
    fun  providesLoginApi(retrofit: Retrofit): LoginApi{
        return  retrofit.create(LoginApi::class.java)
    }

}