package com.example.myapplication.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.tv.foundation.lazy.list.TvLazyRow
import androidx.tv.foundation.lazy.list.items
import androidx.tv.material3.*
import coil.compose.AsyncImage
import com.example.myapplication.data.api.RetrofitClient
import com.example.myapplication.data.model.Facility
import com.example.myapplication.data.model.Information
import com.example.myapplication.ui.theme.*

@Composable
fun InfoScreen(onBack: () -> Unit) {
    var facilities by remember { mutableStateOf<List<Facility>>(emptyList()) }
    var infos by remember { mutableStateOf<List<Information>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        try {
            val resF = RetrofitClient.apiService.getFacilities()
            val resI = RetrofitClient.apiService.getInformations()
            if (resF.isSuccessful) facilities = resF.body() ?: emptyList()
            if (resI.isSuccessful) infos = resI.body() ?: emptyList()
        } catch (e: Exception) { } finally { loading = false }
    }

    Box(modifier = Modifier.fillMaxSize().background(NeoBlack).padding(32.dp)) {
        Column(modifier = Modifier.fillMaxSize()) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Button(onClick = onBack, colors = ButtonDefaults.colors(containerColor = NeoWhite)) {
                    Text("← KEMBALI", color = NeoBlack, fontWeight = FontWeight.Black)
                }
                Spacer(modifier = Modifier.width(16.dp))
                Text("DIREKTORI & INFORMASI HOTEL", color = NeoWhite, fontWeight = FontWeight.Black, fontSize = 32.sp)
            }

            Spacer(modifier = Modifier.height(24.dp))

            if (loading) {
                 Text("Memuat data...", color = NeoWhite, modifier = Modifier.align(Alignment.CenterHorizontally))
            } else {
                 Row(modifier = Modifier.fillMaxSize(), horizontalArrangement = Arrangement.spacedBy(24.dp)) {
                     // Kiri: Pengumuman (LazyColumn)
                     Column(modifier = Modifier.weight(1f)) {
                         Box(modifier = Modifier.background(NeoPink).border(4.dp, NeoBlack).padding(12.dp).fillMaxWidth()) {
                             Text("PENGUMUMAN PENTING", color = NeoWhite, fontWeight = FontWeight.Black, fontSize = 20.sp)
                         }
                         Spacer(modifier = Modifier.height(16.dp))
                         LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                             items(infos) { info ->
                                 Box(modifier = Modifier.fillMaxWidth().background(NeoWhite).border(4.dp, NeoBlack).padding(16.dp)) {
                                     Column {
                                         Text(info.title, color = NeoBlack, fontWeight = FontWeight.Black, fontSize = 18.sp)
                                         Spacer(modifier = Modifier.height(8.dp))
                                         Text(info.description ?: "", color = NeoBlack, fontSize = 14.sp, lineHeight = 20.sp)
                                     }
                                 }
                             }
                         }
                     }

                     // Kanan: Fasilitas (Grid / Column)
                     Column(modifier = Modifier.weight(1f)) {
                         Box(modifier = Modifier.background(NeoBlue).border(4.dp, NeoBlack).padding(12.dp).fillMaxWidth()) {
                             Text("FASILITAS HOTEL", color = NeoWhite, fontWeight = FontWeight.Black, fontSize = 20.sp)
                         }
                         Spacer(modifier = Modifier.height(16.dp))
                         LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                             items(facilities) { fac ->
                                 Row(modifier = Modifier.fillMaxWidth().background(NeoWhite).border(4.dp, NeoBlack).height(120.dp)) {
                                     if (!fac.image_url.isNullOrEmpty()) {
                                         AsyncImage(
                                             model = fac.image_url,
                                             contentDescription = fac.name,
                                             modifier = Modifier.width(120.dp).fillMaxHeight().border(end = 4.dp, color = NeoBlack),
                                             contentScale = ContentScale.Crop
                                         )
                                     } else {
                                         Box(modifier = Modifier.width(120.dp).fillMaxHeight().background(NeoGray).border(end = 4.dp, color = NeoBlack), contentAlignment = Alignment.Center) {
                                              Text("🏨", fontSize = 42.sp)
                                         }
                                     }
                                     Column(modifier = Modifier.padding(12.dp)) {
                                         Text(fac.name, color = NeoBlack, fontWeight = FontWeight.Black, fontSize = 18.sp)
                                         Spacer(modifier = Modifier.height(4.dp))
                                         Text(fac.description ?: "", color = NeoBlack, fontSize = 14.sp)
                                     }
                                 }
                             }
                         }
                     }
                 }
            }
        }
    }
}
