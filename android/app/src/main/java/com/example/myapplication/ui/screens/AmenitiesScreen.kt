package com.example.myapplication.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.tv.material3.*
import coil.compose.AsyncImage
import com.example.myapplication.data.api.RetrofitClient
import com.example.myapplication.data.model.Amenity
import com.example.myapplication.data.model.AmenityRequestItem
import com.example.myapplication.data.model.TVRequestCreate
import com.example.myapplication.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun AmenitiesScreen(deviceId: String, onBack: () -> Unit) {
    val scope = rememberCoroutineScope()
    var items by remember { mutableStateOf<List<Amenity>>(emptyList()) }
    var cart by remember { mutableStateOf<Map<Amenity, Int>>(emptyMap()) }
    var loading by remember { mutableStateOf(true) }
    var statusText by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(Unit) {
        try {
            val res = RetrofitClient.apiService.getAmenities()
            if (res.isSuccessful && res.body() != null) {
                items = res.body()!!
            }
        } catch (e: Exception) { } finally { loading = false }
    }

    val totalItems = cart.values.sum()

    fun addToCart(am: Amenity) {
        val current = cart[am] ?: 0
        cart = cart + (am to current + 1)
    }

    fun submitRequest() {
        if (cart.isEmpty()) return
        loading = true
        scope.launch {
            try {
                val reqItems = cart.map { AmenityRequestItem(it.key.name, it.value) }
                val request = TVRequestCreate(device_id = deviceId, items = reqItems)
                val res = RetrofitClient.apiService.createRequest(request)
                if (res.isSuccessful) {
                    statusText = "Permintaan berhasil dikirim ke Housekeeping!"
                    cart = emptyMap()
                } else {
                    statusText = "Gagal Mengirim Permintaan."
                }
            } catch (e: Exception) {
                statusText = "Koneksi Terputus."
            } finally {
                loading = false
            }
        }
    }

    Box(modifier = Modifier.fillMaxSize().background(NeoBlack).padding(32.dp)) {
        if (statusText != null) {
             Column(modifier = Modifier.align(Alignment.Center), horizontalAlignment = Alignment.CenterHorizontally) {
                 Box(modifier = Modifier.background(NeoGreen).border(4.dp, NeoBlack).padding(24.dp)) {
                     Text(statusText!!, color = NeoBlack, fontWeight = FontWeight.Black, fontSize = 24.sp)
                 }
                 Spacer(modifier = Modifier.height(24.dp))
                 Button(onClick = { statusText = null; onBack() }, colors = ButtonDefaults.colors(containerColor = NeoWhite)) {
                     Text("KEMBALI KE HOME", color = NeoBlack)
                 }
             }
            return@Box
        }

        Column(modifier = Modifier.fillMaxSize()) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Button(onClick = onBack, colors = ButtonDefaults.colors(containerColor = NeoWhite)) {
                        Text("← KEMBALI", color = NeoBlack, fontWeight = FontWeight.Black)
                    }
                    Spacer(modifier = Modifier.width(16.dp))
                    Text("HOUSEKEEPING KELON", color = NeoWhite, fontWeight = FontWeight.Black, fontSize = 32.sp)
                }

                if (totalItems > 0) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(modifier = Modifier.background(NeoYellow).border(4.dp, NeoBlack).padding(horizontal = 16.dp, vertical = 8.dp)) {
                            Text("$totalItems Barang Diminta", color = NeoBlack, fontWeight = FontWeight.Black)
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Button(onClick = { submitRequest() }, colors = ButtonDefaults.colors(containerColor = NeoGreen)) {
                            Text("MINTA SEKARANG", color = NeoBlack, fontWeight = FontWeight.Black)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            if (loading) {
                Text("Memuat daftar amenitas...", color = NeoWhite, modifier = Modifier.align(Alignment.CenterHorizontally))
            } else if (items.isEmpty()) {
                Text("Tidak ada barang tambahan yang tersedia.", color = NeoWhite)
            } else {
                LazyVerticalGrid(
                    columns = GridCells.Fixed(4),
                    horizontalArrangement = Arrangement.spacedBy(16.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(items) { item ->
                         AmenityCard(item = item, qty = cart[item] ?: 0) {
                             addToCart(item)
                         }
                    }
                }
            }
        }
    }
}

@Composable
fun AmenityCard(item: Amenity, qty: Int, onClick: () -> Unit) {
    Surface(
        onClick = onClick,
        colors = ClickableSurfaceDefaults.colors(
            containerColor = NeoWhite,
            focusedContainerColor = NeoGreen
        ),
        modifier = Modifier.fillMaxWidth().height(180.dp),
        shape = ClickableSurfaceDefaults.shape(shape = androidx.compose.foundation.shape.RoundedCornerShape(0.dp)),
        border = ClickableSurfaceDefaults.border(
            border = androidx.compose.foundation.BorderStroke(4.dp, NeoBlack),
            focusedBorder = androidx.compose.foundation.BorderStroke(8.dp, NeoBlack)
        )
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            Box(modifier = Modifier.fillMaxWidth().weight(1f).background(NeoGray)) {
                if (!item.image_url.isNullOrEmpty()) {
                    AsyncImage(
                        model = item.image_url,
                        contentDescription = item.name,
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                    )
                }
                if (qty > 0) {
                    Box(modifier = Modifier.background(NeoGreen).border(4.dp, NeoBlack).align(Alignment.TopEnd).padding(8.dp)) {
                        Text("$qtyx", color = NeoBlack, fontWeight = FontWeight.Black)
                    }
                }
            }
            Box(modifier = Modifier.fillMaxWidth().background(NeoWhite).border(top = 4.dp, color = NeoBlack).padding(12.dp)) {
                Column {
                    Text(item.name, color = NeoBlack, fontWeight = FontWeight.Black, fontSize = 16.sp, maxLines = 1)
                    if (!item.description.isNullOrEmpty()) {
                         Text(item.description, color = NeoBlack, fontSize = 12.sp, maxLines = 1)
                    }
                }
            }
        }
    }
}
