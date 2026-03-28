package com.example.myapplication.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.tv.foundation.lazy.list.TvLazyRow
import androidx.tv.foundation.lazy.list.items
import androidx.tv.material3.*
import coil.compose.AsyncImage
import com.example.myapplication.data.model.AppShortcut
import com.example.myapplication.data.model.TVHomeData
import com.example.myapplication.ui.theme.*
import kotlinx.coroutines.delay

@Composable
fun HomeScreen(
    homeData: TVHomeData,
    deviceId: String,
    onNavigateToDining: () -> Unit,
    onNavigateToAmenities: () -> Unit,
    onNavigateToInfo: () -> Unit
) {
    val context = LocalContext.current
    var timeText by remember { mutableStateOf("00:00") }

    // Jam Realtime
    LaunchedEffect(Unit) {
        while (true) {
            val sdf = java.text.SimpleDateFormat("HH:mm", java.util.Locale.getDefault())
            timeText = sdf.format(java.util.Date())
            delay(1000)
        }
    }

    Box(modifier = Modifier.fillMaxSize().background(NeoBlack)) {
        // Layar Latar Belakang (Dinamis dari Dashboard)
        if (!homeData.background_url.isNullOrEmpty()) {
            AsyncImage(
                model = homeData.background_url,
                contentDescription = "Background",
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop,
                alpha = 0.4f
            )
        }

        Column(modifier = Modifier.fillMaxSize().padding(48.dp)) {
            
            // Header: Logo, Waktu, Info Tamu
            Row(
                modifier = Modifier.fillMaxWidth(), 
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(modifier = Modifier.background(NeoYellow).border(4.dp, NeoBlack).padding(horizontal = 16.dp, vertical = 8.dp)) {
                        Text("⚡ OSKA IPTV", color = NeoBlack, fontWeight = FontWeight.Black, fontSize = 24.sp)
                    }
                    Spacer(modifier = Modifier.width(16.dp))
                    Text(timeText, color = NeoWhite, fontWeight = FontWeight.Black, fontSize = 42.sp)
                }

                Box(modifier = Modifier.background(NeoPink).border(4.dp, NeoBlack).padding(horizontal = 24.dp, vertical = 12.dp)) {
                    Column(horizontalAlignment = Alignment.End) {
                        Text("Kamar: ${homeData.room_number ?: "BELUM TERDAFTAR"}", color = NeoWhite, fontWeight = FontWeight.Black, fontSize = 20.sp)
                        if (homeData.guest_name != null) {
                            Text("Tamu: ${homeData.guest_name}", color = NeoWhite, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        }
                    }
                }
            }

            // Marquee Pesan Selamat Datang
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 32.dp)
                    .background(NeoWhite)
                    .border(6.dp, NeoBlack)
                    .padding(24.dp)
            ) {
                Text(
                    text = homeData.marquee_text,
                    color = NeoBlack,
                    fontWeight = FontWeight.Black,
                    fontSize = 28.sp,
                    maxLines = 1
                )
            }

            Spacer(modifier = Modifier.weight(1f))

            // Layanan Utama (OSKA Internal Features)
            Text("LAYANAN HOTEL", color = NeoWhite, fontWeight = FontWeight.Black, fontSize = 20.sp, modifier = Modifier.padding(bottom = 12.dp))
            TvLazyRow(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                item {
                    InternalFeatureCard("PESAN MAKAN", "🍳", NeoYellow) { onNavigateToDining() }
                }
                item {
                    InternalFeatureCard("HOUSEKEEPING", "🧹", NeoGreen) { onNavigateToAmenities() }
                }
                item {
                    InternalFeatureCard("INFO & FASILITAS", "ℹ️", NeoBlue) { onNavigateToInfo() }
                }
            }

            Spacer(modifier = Modifier.height(32.dp))

            // Entertainment Apps (Netflix, Youtube via Kiosk Intent)
            Text("HIBURAN ANDA", color = NeoWhite, fontWeight = FontWeight.Black, fontSize = 20.sp, modifier = Modifier.padding(bottom = 12.dp))
            TvLazyRow(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                items(homeData.apps) { app ->
                    AppShortcutCard(app) {
                        IntentUtils.launchAppByPackageName(context, app.package_name)
                    }
                }
            }
        }
    }
}

@Composable
fun InternalFeatureCard(title: String, icon: String, bgColor: androidx.compose.ui.graphics.Color, onClick: () -> Unit) {
    Surface(
        onClick = onClick,
        colors = ClickableSurfaceDefaults.colors(
            containerColor = bgColor,
            focusedContainerColor = NeoWhite,
            pressedContainerColor = NeoGray
        ),
        modifier = Modifier.size(200.dp, 120.dp),
        shape = ClickableSurfaceDefaults.shape(shape = androidx.compose.foundation.shape.RoundedCornerShape(0.dp)),
        border = ClickableSurfaceDefaults.border(
            border = androidx.compose.foundation.BorderStroke(4.dp, NeoBlack),
            focusedBorder = androidx.compose.foundation.BorderStroke(8.dp, NeoBlack)
        )
    ) {
        Column(
            modifier = Modifier.fillMaxSize().padding(16.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(icon, fontSize = 42.sp)
            Spacer(modifier = Modifier.height(8.dp))
            Text(title, color = NeoBlack, fontWeight = FontWeight.Black, fontSize = 16.sp)
        }
    }
}

@Composable
fun AppShortcutCard(app: AppShortcut, onClick: () -> Unit) {
    Surface(
        onClick = onClick,
        colors = ClickableSurfaceDefaults.colors(
            containerColor = NeoWhite,
            focusedContainerColor = NeoYellow
        ),
        modifier = Modifier.size(160.dp, 100.dp),
        shape = ClickableSurfaceDefaults.shape(shape = androidx.compose.foundation.shape.RoundedCornerShape(0.dp)),
        border = ClickableSurfaceDefaults.border(
            border = androidx.compose.foundation.BorderStroke(4.dp, NeoBlack),
            focusedBorder = androidx.compose.foundation.BorderStroke(8.dp, NeoBlack)
        )
    ) {
        Column(
            modifier = Modifier.fillMaxSize().padding(12.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            if (!app.icon_url.isNullOrEmpty()) {
                AsyncImage(model = app.icon_url, contentDescription = app.app_name, modifier = Modifier.size(48.dp))
            } else {
                Text("📺", fontSize = 32.sp)
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(app.app_name, color = NeoBlack, fontWeight = FontWeight.Black, fontSize = 14.sp)
        }
    }
}
