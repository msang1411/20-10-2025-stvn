// Celebration Card JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Initialize celebration
  initializeCelebration();

  // Auto-play celebration effects
  startCelebrationEffects();
});

function initializeCelebration() {
  // Add entrance animation to elements
  const elements = document.querySelectorAll(
    ".character-section, .message-box, .celebration-actions"
  );
  elements.forEach((element, index) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";

    setTimeout(() => {
      element.style.transition = "all 0.8s ease-out";
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }, 500 + index * 200);
  });
}

function startCelebrationEffects() {
  // Create additional floating hearts
  createFloatingHearts();

  // Start confetti animation
  startConfettiAnimation();

  // Add sparkle effects
  createSparkleEffects();
}

function createFloatingHearts() {
  const heartsContainer = document.querySelector(".floating-hearts");
  const heartEmojis = ["💖", "🌸", "💕", "🌺", "💗", "🌷", "✨", "🎀"];

  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const heart = document.createElement("div");
      heart.className = "heart";
      heart.textContent =
        heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
      heart.style.left = Math.random() * 100 + "%";
      heart.style.animationDuration = Math.random() * 3 + 4 + "s";
      heart.style.animationDelay = Math.random() * 2 + "s";
      heartsContainer.appendChild(heart);

      // Remove heart after animation
      setTimeout(() => {
        if (heart.parentNode) {
          heart.parentNode.removeChild(heart);
        }
      }, 8000);
    }, i * 500);
  }
}

function startConfettiAnimation() {
  const confettiContainer = document.querySelector(".confetti-container");

  // Create more confetti pieces
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.animationDuration = Math.random() * 2 + 2 + "s";
      confetti.style.animationDelay = Math.random() * 1 + "s";

      // Random colors
      const colors = [
        "#ff6b9d",
        "#ff8fab",
        "#ffd700",
        "#4CAF50",
        "#2196F3",
        "#9C27B0",
        "#FF9800",
        "#E91E63",
      ];
      confetti.style.background =
        colors[Math.floor(Math.random() * colors.length)];

      confettiContainer.appendChild(confetti);

      // Remove confetti after animation
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, 5000);
    }, i * 100);
  }
}

function createSparkleEffects() {
  const card = document.querySelector(".celebration-card");

  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      const sparkle = document.createElement("div");
      sparkle.innerHTML = "✨";
      sparkle.style.position = "absolute";
      sparkle.style.fontSize = "1.5rem";
      sparkle.style.pointerEvents = "none";
      sparkle.style.left = Math.random() * 100 + "%";
      sparkle.style.top = Math.random() * 100 + "%";
      sparkle.style.animation = "sparkle 2s ease-in-out infinite";
      sparkle.style.animationDelay = Math.random() * 2 + "s";

      card.appendChild(sparkle);

      // Remove sparkle after animation
      setTimeout(() => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      }, 4000);
    }, i * 300);
  }
}

function playCelebrationSound() {
  const audio = document.getElementById("celebrationMusic");

  if (audio) {
    // Try to play the audio
    audio
      .play()
      .then(() => {
        console.log("Celebration music started");
        // Update button text
        const button = event.target.closest("button");
        if (button) {
          const originalText = button.innerHTML;
          button.innerHTML = '<i class="fas fa-pause"></i> Dừng nhạc';
          button.onclick = function () {
            audio.pause();
            button.innerHTML = originalText;
            button.onclick = playCelebrationSound;
          };
        }
      })
      .catch((error) => {
        console.log("Could not play audio:", error);
        // Fallback: show a message
        showNotification(
          "🎵 Cảm ơn bạn đã nghe nhạc ! - Chúc bạn có một ngày lễ thật vui vẻ và hạnh phúc.",
          "success"
        );
      });
  } else {
    // Fallback notification
    showNotification("🎵 Cảm ơn bạn đã nghe nhạc !", "success");
  }
}

function shareCelebration() {
  const shareData = {
    title: "Chúc mừng ngày 20/10!",
    text: "Tôi vừa hoàn thành Quiz 20/10 với nhân vật Emma - Lập trình viên tài năng! 🌸",
    url: window.location.href,
  };

  if (navigator.share) {
    navigator
      .share(shareData)
      .then(() => {
        showNotification("🎉 Đã chia sẻ thiệp chúc mừng!", "success");
      })
      .catch((error) => {
        console.log("Error sharing:", error);
        fallbackShare();
      });
  } else {
    fallbackShare();
  }
}

function fallbackShare() {
  // Copy URL to clipboard
  navigator.clipboard
    .writeText(window.location.href)
    .then(() => {
      showNotification("📋 Đã copy link thiệp vào clipboard!", "success");
    })
    .catch(() => {
      // Show URL for manual copy
      const url = window.location.href;
      showNotification(`📋 Copy link này để chia sẻ: ${url}`, "info");
    });
}

function goBackToGame() {
  // Go back to the main game
  if (window.opener) {
    window.close();
  } else {
    window.location.href = "index.html";
  }
}

function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${
          type === "success"
            ? "#4CAF50"
            : type === "error"
            ? "#f44336"
            : "#2196F3"
        };
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;

  // Add to page
  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = "slideOut 0.3s ease-in";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }, 5000);
}

// Add CSS animations for notifications
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes sparkle {
        0%, 100% {
            opacity: 0;
            transform: scale(0.5) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
    }
`;
document.head.appendChild(style);

// Add click effects to buttons
document.addEventListener("click", function (e) {
  if (e.target.matches("button")) {
    // Create ripple effect
    const button = e.target;
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

    button.style.position = "relative";
    button.style.overflow = "hidden";
    button.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }
});

// Add ripple animation
const rippleStyle = document.createElement("style");
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);
// --- Manual play when user first interacts with the page ---
function enableMusicOnUserClick() {
  const audio = document.getElementById("celebrationMusic");
  if (!audio) return;

  const tryPlayMusic = () => {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("🎵 Music started after user click/touch");
          // Chỉ chạy 1 lần
          document.removeEventListener("click", tryPlayMusic); // ok
          document.removeEventListener("touchstart", tryPlayMusic); // ok
          document.removeEventListener("scroll", tryPlayMusic); // false
          document.removeEventListener("mousemove", tryPlayMusic); // false
          document.removeEventListener("touchmove", tryPlayMusic); // false
        })
        .catch((err) => {
          console.warn("⚠️ Could not play audio:", err);
        });
    }
  };

  // Kích hoạt khi người dùng click hoặc chạm lần đầu
  document.addEventListener("click", tryPlayMusic);
  document.addEventListener("touchstart", tryPlayMusic);
}

// Chạy khi trang tải xong
window.addEventListener("load", enableMusicOnUserClick);
