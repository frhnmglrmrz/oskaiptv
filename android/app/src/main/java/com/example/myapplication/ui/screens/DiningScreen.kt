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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.tv.material3.*
import coil.compose.AsyncImage
import com.example.myapplication.data.api.RetrofitClient
import com.example.myapplication.data.model.CartItem
import com.example.myapplication.data.model.DiningMenu
import com.example.myapplication.data.model.TVOrderCreate
import com.example.myapplication.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun DiningScreen(deviceId: String, onBack: () -> Unit) {
    val scope = rememberCoroutineScope()
    var menus by remember { mutableStateOf<List<DiningMenu>>(emptyList()) }
    var cart by remember { mutableStateOf<Map<DiningMenu, Int>>(emptyMap()) }
    var loading by remember { mutableStateOf(true) }
    var orderStatus by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(Unit) {
        try {
            val res = RetrofitClient.apiService.getDiningMenu()
            if (res.isSuccessful && res.body() != null) {
                menus = res.body()!!
            }
        } catch (e: Exception) {
            // Error handling
        } finally {
            loading = false
        }
    }

    val totalItems = cart.values.sum()
    val totalPrice = cart.entries.sumOf { it.key.price * it.value }

    fun addToCart(menu: DiningMenu) {
        val current = cart[menu] ?: 0
        cart = cart + (menu to current + 1)
    }

    fun submitOrder() {
        if (cart.isEmpty()) return
        loading = true
        scope.launch {
            try {
                val orderItems = cart.map { CartItem(it.key.name, it.value, it.key.price) }
                val request = TVOrderCreate(device_id = deviceId, items = orderItems)
                val res = RetrofitClient.apiService.createOrder(request)
                if (res.isSuccessful) {
                    orderStatus = "Pesanan Berhasil Dikirim ke Dapur!"
                    cart = emptyMap()
                } else {
                    orderStatus = "Gagal Mengirim Pesanan."
                }
            } catch (e: Exception) {
                orderStatus = "Koneksi Terputus."
            } finally {
                loading = false
            }
        }
    }

    Box(modifier = Modifier.fillMaxSize().background(NeoBlack).padding(32.dp)) {
        if (orderStatus != null) {
             Column(modifier = Modifier.align(Alignment.Center), horizontalAlignment = Alignment.CenterHorizontally) {
                 Box(modifier = Modifier.background(NeoGreen).border(4.dp, NeoBlack).padding(24.dp)) {
                     Text(orderStatus!!, color = NeoBlack, fontWeight = FontWeight.Black, fontSize = 24.sp)
                 }
                 Spacer(modifier = Modifier.height(24.dp))
                 Button(onClick = { orderStatus = null; onBack() }, colors = ButtonDefaults.colors(containerColor = NeoWhite)) {
                     Text("KEMBALI KE HOME", color = NeoBlack)
                 }
             }
            return@Box
        }

        Column(modifier = Modifier.fillMaxSize()) {
            // Header
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Button(onClick = onBack, colors = ButtonDefaults.colors(containerColor = NeoWhite)) {
                        Text("← KEMBALI", color = NeoBlack, fontWeight = FontWeight.Black)
                    }
                    Spacer(modifier = Modifier.width(16.dp))
                    Text("ROOM SERVICE (MAKANAN)", color = NeoWhite, fontWeight = FontWeight.Black, fontSize = 32.sp)
                }

                if (totalItems > 0) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(modifier = Modifier.background(NeoYellow).border(4.dp, NeoBlack).padding(horizontal = 16.dp, vertical = 8.dp)) {
                            Text("$totalItems Porsi | Total: Rp $totalPrice", color = NeoBlack, fontWeight = FontWeight.Black)
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Button(onClick = { submitOrder() }, colors = ButtonDefaults.colors(containerColor = NeoPink)) {
                            Text("PESAN SEKARANG", color = NeoWhite, fontWeight = FontWeight.Black)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            if (loading) {
                Text("Memuat menu masakan...", color = NeoWhite, modifier = Modifier.align(Alignment.CenterHorizontally))
            } else if (menus.isEmpty()) {
                Text("Tidak ada menu yang tersedia.", color = NeoWhite)
            } else {
                LazyVerticalGrid(
                    columns = GridCells.Fixed(3),
                    horizontalArrangement = Arrangement.spacedBy(16.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(menus) { menu ->
                         MenuCard(menu = menu, qty = cart[menu] ?: 0) {
                             addToCart(menu)
                         }
                    }
                }
            }
        }
    }
}

@Composable
fun MenuCard(menu: DiningMenu, qty: Int, onClick: () -> Unit) {
    Surface(
        onClick = onClick,
        colors = ClickableSurfaceDefaults.colors(
            containerColor = NeoWhite,
            focusedContainerColor = NeoYellow
        ),
        modifier = Modifier.fillMaxWidth().height(220.dp),
        shape = ClickableSurfaceDefaults.shape(shape = androidx.compose.foundation.shape.RoundedCornerShape(0.dp)),
        border = ClickableSurfaceDefaults.border(
            border = androidx.compose.foundation.BorderStroke(4.dp, NeoBlack),
            focusedBorder = androidx.compose.foundation.BorderStroke(8.dp, NeoBlack)
        )
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            Box(modifier = Modifier.fillMaxWidth().weight(1f).background(NeoGray)) {
                if (!menu.image_url.isNullOrEmpty()) {
                    AsyncImage(
                        model = menu.image_url,
                        contentDescription = menu.name,
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                    )
                }
                if (qty > 0) {
                    Box(modifier = Modifier.background(NeoPink).border(4.dp, NeoBlack).align(Alignment.TopEnd).padding(8.dp)) {
                        Text("$qtyx", color = NeoWhite, fontWeight = FontWeight.Black)
                    }
                }
            }
            Box(modifier = Modifier.fillMaxWidth().background(NeoWhite).border(top = 4.dp, color = NeoBlack).padding(12.dp)) {
                Column {
                    Text(menu.name, color = NeoBlack, fontWeight = FontWeight.Black, fontSize = 18.sp, maxLines = 1)
                    Text("Rp ${menu.price}", color = NeoBlack, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                }
            }
        }
    }
}
