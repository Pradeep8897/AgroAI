package com.agroai.app

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.View
import android.view.animation.AlphaAnimation
import android.view.animation.DecelerateInterpolator
import androidx.appcompat.app.AppCompatActivity

class SplashActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash)

        // Make the content fade in nicely
        val logoGlow = findViewById<View>(R.id.logo_glow)
        val logoIcon = findViewById<View>(R.id.logo_icon)
        val logoText = findViewById<View>(R.id.logo_text)
        val logoSub = findViewById<View>(R.id.logo_sub)

        val fadeIn = AlphaAnimation(0f, 1f).apply {
            interpolator = DecelerateInterpolator()
            duration = 1000
        }

        logoGlow.startAnimation(fadeIn)
        logoIcon.startAnimation(fadeIn)
        logoText.startAnimation(fadeIn)
        logoSub.startAnimation(fadeIn)

        // Transition to MainActivity after 2000 milliseconds
        Handler(Looper.getMainLooper()).postDelayed({
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
            finish()
        }, 2000)
    }
}
