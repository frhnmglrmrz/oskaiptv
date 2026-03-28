package com.example.myapplication.ui.theme

import androidx.compose.runtime.Composable
import androidx.tv.material3.MaterialTheme
import androidx.tv.material3.Typography
import androidx.tv.material3.darkColorScheme

val OskaColorScheme = darkColorScheme(
    primary = NeoPink,
    secondary = NeoYellow,
    tertiary = NeoBlue,
    background = NeoBlack,
    surface = NeoWhite,
    onSurface = NeoBlack
)

@Composable
fun OskaTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = OskaColorScheme,
        typography = Typography(),
        content = content
    )
}