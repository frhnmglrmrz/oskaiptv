package com.example.myapplication.data.api

import com.example.myapplication.data.model.*
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

interface ApiService {

    @POST("tv/register")
    suspend fun registerTv(@Body request: TVRegisterRequest): Response<TVRegisterResponse>

    @GET("tv/home")
    suspend fun getHomeData(@Query("device_id") deviceId: String): Response<TVHomeData>

    @GET("tv/dining")
    suspend fun getDiningMenu(): Response<List<DiningMenu>>

    @POST("tv/dining/order")
    suspend fun createOrder(@Body request: TVOrderCreate): Response<Any>

    @GET("tv/amenities")
    suspend fun getAmenities(): Response<List<Amenity>>

    @POST("tv/amenities/request")
    suspend fun createRequest(@Body request: TVRequestCreate): Response<Any>

    @GET("admin/facilities") // Public admin route from router
    suspend fun getFacilities(): Response<List<Facility>>

    @GET("admin/informations")
    suspend fun getInformations(): Response<List<Information>>

    @GET("tv/check-update")
    suspend fun checkUpdate(): Response<TVUpdateResponse>
}
