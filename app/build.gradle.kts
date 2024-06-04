plugins {
    alias(libs.plugins.androidApplication)
    alias(libs.plugins.jetbrainsKotlinAndroid)


}




android {
    namespace = "com.example.wattmok"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.wattmok"
        minSdk = 30
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }

    buildFeatures{
        viewBinding=true;
    }
}

dependencies {

    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    implementation(libs.androidx.activity)
    implementation(libs.androidx.constraintlayout)
    implementation(libs.androidx.navigation.fragment.ktx)
    implementation(libs.androidx.navigation.ui.ktx)
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)




    









    // retrofit
//    implementation ("com.squareup.retrofit2:retrofit:2.9.0")
//    // gson converter
//    implementation ("com.squareup.retrofit2:converter-gson:2.9.0")


    implementation ("com.google.dagger:hilt-android:2.38.1")
//    kapt ("com.google.dagger:hilt-compiler:2.38.1")

//    lifecycle
    implementation ("androidx.lifecycle:lifecycle-viewmodel-ktx:2.5.0")
    implementation ("androidx.lifecycle:lifecycle-livedata-ktx:2.5.0")
// retrofit_version
    implementation ("com.squareup.retrofit2:retrofit:2.9.0")
    implementation ("com.squareup.retrofit2:converter-gson:2.9.0")
    implementation ("com.squareup.okhttp3:okhttp:4.9.3")

    val room_version = "2.4.2"
    implementation ("androidx.room:room-runtime:$room_version")
    implementation ("androidx.room:room-ktx:$room_version")
//    kapt ("androidx.room:room-compiler:$room_version")

    val coroutines_version = "1.6.0"
    implementation ("org.jetbrains.kotlinx:kotlinx-coroutines-core:$coroutines_version")
    implementation ("org.jetbrains.kotlinx:kotlinx-coroutines-android:$coroutines_version")

    val navigation_version = "2.4.2"
    implementation ("androidx.navigation:navigation-fragment-ktx:$navigation_version")
    implementation ("androidx.navigation:navigation-ui-ktx:$navigation_version")

    implementation ("com.github.ybq:Android-SpinKit:1.4.0")





}