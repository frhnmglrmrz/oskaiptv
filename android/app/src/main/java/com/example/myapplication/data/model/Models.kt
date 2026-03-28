package com.example.myapplication.data.model

data class TVHomeData(
    val room_number: String?,
    val guest_name: String?,
    val marquee_text: String,
    val background_url: String?,
    val apps: List<AppShortcut>
)

data class AppShortcut(
    val id: String,
    val app_name: String,
    val package_name: String?,
    val icon_url: String?,
    val sort_order: Int
)

data class DiningMenu(
    val id: String,
    val name: String,
    val price: Double,
    val image_url: String?,
    val is_available: Boolean
)

data class CartItem(
    val menu_name: String,
    val quantity: Int,
    val price_per_item: Double
)

data class TVOrderCreate(
    val device_id: String,
    val items: List<CartItem>
)

data class TVRegisterRequest(
    val device_id: String,
    val device_name: String
)

data class TVRegisterResponse(
    val id: String,
    val registered: Boolean
)

data class Amenity(
    val id: String,
    val name: String,
    val description: String?,
    val image_url: String?
)

data class AmenityRequestItem(
    val amenity_name: String,
    val quantity: Int
)

data class TVRequestCreate(
    val device_id: String,
    val items: List<AmenityRequestItem>
)

data class Facility(
    val id: String,
    val name: String,
    val description: String?,
    val image_url: String?
)

data class Information(
    val id: String,
    val title: String,
    val description: String?,
    val image_url: String?
)

data class TVUpdateResponse(
    val available: Boolean,
    val version: String?,
    val url: String?
)
