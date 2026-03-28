package com.example.myapplication.utils

import android.app.DownloadManager
import android.content.Context
import android.net.Uri
import android.os.Environment
import android.widget.Toast
import com.example.myapplication.data.api.RetrofitClient
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

object UpdateHelper {
    suspend fun checkForUpdates(context: Context) {
        withContext(Dispatchers.IO) {
            try {
                val response = RetrofitClient.apiService.checkUpdate()
                if (response.isSuccessful) {
                    val data = response.body()
                    if (data?.available == true && !data.url.isNullOrEmpty()) {
                        withContext(Dispatchers.Main) {
                            Toast.makeText(context, "Pembaruan Sistem Tersedia: ${data.version}. Mengunduh...", Toast.LENGTH_LONG).show()
                            startDownload(context, data.url, data.version ?: "latest")
                        }
                    }
                }
            } catch (e: Exception) {
                // Abaikan jika tidak ada koneksi
            }
        }
    }

    private fun startDownload(context: Context, url: String, version: String) {
        try {
            val request = DownloadManager.Request(Uri.parse(url))
                .setTitle("OSKA IPTV Update v$version")
                .setDescription("Mengunduh pembaruan rilis sistem...")
                .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                .setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, "oska_iptv_$version.apk")
                .setAllowedOverMetered(true)

            val manager = context.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
            manager.enqueue(request)
        } catch (e: Exception) {
            Toast.makeText(context, "Gagal mengunduh pembaruan.", Toast.LENGTH_SHORT).show()
        }
    }
}
