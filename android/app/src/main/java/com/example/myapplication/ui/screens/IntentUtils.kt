package com.example.myapplication.ui.screens

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast

object IntentUtils {
    // Fungsi khusus untuk me-launch aplikasi Native TV lain (Netflix, Youtube, Spotify) dari dalam Kiosk kita
    fun launchAppByPackageName(context: Context, packageName: String?) {
        if (packageName.isNullOrEmpty()) {
            Toast.makeText(context, "Package kosong!", Toast.LENGTH_SHORT).show()
            return
        }
        val intent = context.packageManager.getLaunchIntentForPackage(packageName)
        if (intent != null) {
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(intent)
        } else {
            // Jika aplikasi belum diinstal, larikan ke Google Play Store TV
            try {
                val playIntent = Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=$packageName"))
                playIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                context.startActivity(playIntent)
            } catch (e: Exception) {
                Toast.makeText(context, "Aplikasi tidak ditemukan", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
