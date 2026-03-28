package com.example.myapplication

import android.os.Bundle
import android.provider.Settings
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.tv.material3.Text
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.myapplication.data.api.RetrofitClient
import com.example.myapplication.data.model.TVHomeData
import com.example.myapplication.data.model.TVRegisterRequest
import com.example.myapplication.ui.screens.HomeScreen
import com.example.myapplication.ui.theme.NeoBlack
import com.example.myapplication.ui.theme.NeoPink
import com.example.myapplication.ui.theme.NeoWhite
import com.example.myapplication.ui.theme.OskaTheme
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Membaca Device ID Khas STB / Smartphone
        val deviceId = Settings.Secure.getString(contentResolver, Settings.Secure.ANDROID_ID) ?: "UNKNOWN_TV"

        setContent {
            OskaTheme {
                val navController = rememberNavController()
                
                NavHost(navController = navController, startDestination = "splash") {
                    
                    composable("splash") {
                        SplashScreenLoader(deviceId) { homeData ->
                            // Simpan data di backstack atau passing parameter, untuk sederhana kita pass state via global/parameter
                            // Di sini kita navigate ke home dan buang splash dari tumpukan
                            navController.navigate("home") {
                                popUpTo("splash") { inclusive = true }
                            }
                        }
                    }

                    composable("home") {
                        // Idealnya kita ambil ulang data Home dari ViewModel, 
                        // tapi untuk MVP kita muat data di dalam HomeScreen menggunakan fetcher lagi 
                        // atau kita bisa pass data. Mari kita gunakan fetching state di HomeScreen.
                        HomeScreenContainer(deviceId, navController)
                    }
                    
                    composable("dining") {
                        com.example.myapplication.ui.screens.DiningScreen(
                            deviceId = deviceId,
                            onBack = { navController.popBackStack() }
                        )
                    }

                    composable("amenities") {
                        com.example.myapplication.ui.screens.AmenitiesScreen(
                            deviceId = deviceId,
                            onBack = { navController.popBackStack() }
                        )
                    }

                    composable("info") {
                        com.example.myapplication.ui.screens.InfoScreen(
                            onBack = { navController.popBackStack() }
                        )
                    }
                }
            }
        }
    }
}

// Komponen Pembungkus untuk mengambil status API Home
@Composable
fun HomeScreenContainer(deviceId: String, navController: androidx.navigation.NavController) {
    val context = androidx.compose.ui.platform.LocalContext.current
    var homeData by remember { mutableStateOf<TVHomeData?>(null) }
    var error by remember { mutableStateOf("") }

    LaunchedEffect(Unit) {
        try {
            // Cek Update APK di Background (Silent OTA)
            com.example.myapplication.utils.UpdateHelper.checkForUpdates(context)

            val res = RetrofitClient.apiService.getHomeData(deviceId)
            if (res.isSuccessful && res.body() != null) {
                homeData = res.body()
            } else {
                error = "Kamar belum di-binding. Mohon hubungi resepsionis."
            }
        } catch (e: Exception) {
            error = "Gagal terhubung ke Server."
        }
    }

    if (homeData != null) {
        HomeScreen(
            homeData = homeData!!,
            deviceId = deviceId,
            onNavigateToDining = { navController.navigate("dining") },
            onNavigateToAmenities = { navController.navigate("amenities") },
            onNavigateToInfo = { navController.navigate("info") }
        )
    } else {
        Box(modifier = Modifier.fillMaxSize().background(NeoPink), contentAlignment = Alignment.Center) {
            Text(if (error.isEmpty()) "Memuat Dashboard..." else error, color = NeoWhite)
        }
    }
}

@Composable
fun SplashScreenLoader(deviceId: String, onReady: (Boolean) -> Unit) {
    var statusText by remember { mutableStateOf("Menghubungkan ke Server OSKA IPTV...") }
    val scope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        scope.launch {
            try {
                // 1. Register STB API (Menitipkan ID Perangkat ke Resepsionis)
                val request = TVRegisterRequest(device_id = deviceId, device_name = android.os.Build.MODEL)
                val res = RetrofitClient.apiService.registerTv(request)
                
                if (res.isSuccessful && res.body()?.registered == true) {
                    statusText = "Berhasil masuk ke jaringan hotel!"
                    delay(1500)
                    onReady(true)
                } else {
                    statusText = "Akses Ditolak Server!"
                }
            } catch (e: Exception) {
                statusText = "Tidak ada koneksi Internet. Mencoba ulang..."
                delay(3000) // retry loop in real app, skip for MVP
                onReady(true) // Lanjut saja agar UI tampil walaupun error
            }
        }
    }

    Box(modifier = Modifier.fillMaxSize().background(NeoPink), contentAlignment = Alignment.Center) {
        androidx.compose.foundation.layout.Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text("⚡ OSKA IPTV", color = NeoWhite, style = androidx.tv.material3.MaterialTheme.typography.displayLarge)
            androidx.compose.foundation.layout.Spacer(modifier = Modifier.fillMaxSize(0.1f))
            Text(statusText, color = NeoBlack)
        }
    }
}