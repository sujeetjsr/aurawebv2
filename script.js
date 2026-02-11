// Image List
const images = [
    'photo_6082457110810660433_y.jpeg',
    'WhatsApp Image 2026-02-11 at 11.12.27 AM.jpeg',
    'WhatsApp Image 2026-02-11 at 11.12.28 AM(1).jpeg',
    'WhatsApp Image 2026-02-11 at 11.12.28 AM(2).jpeg',
    'WhatsApp Image 2026-02-11 at 11.12.28 AM.jpeg',
    'WhatsApp Image 2026-02-11 at 11.12.29 AM(1).jpeg',
    'WhatsApp Image 2026-02-11 at 11.12.29 AM.jpeg',
    'WhatsApp Image 2026-02-11 at 11.12.30 AM(1).jpeg',
    'WhatsApp Image 2026-02-11 at 11.12.30 AM.jpeg',
    'WhatsApp Image 2026-02-11 at 11.12.31 AM(1).jpeg',
    'WhatsApp Image 2026-02-11 at 11.12.31 AM(2).jpeg',
    'WhatsApp Image 2026-02-11 at 11.12.31 AM.jpeg',
    'WhatsApp Image 2026-02-11 at 11.12.32 AM(1).jpeg',
    'WhatsApp Image 2026-02-11 at 11.12.32 AM.jpeg',
    'WhatsApp Image 2026-02-11 at 11.12.33 AM(1).jpeg',
    'WhatsApp Image 2026-02-11 at 11.12.33 AM(2).jpeg',
    'WhatsApp Image 2026-02-11 at 11.12.33 AM.jpeg',
    'WhatsApp Image 2026-02-11 at 11.12.34 AM(1).jpeg',
    'WhatsApp Image 2026-02-11 at 11.12.34 AM.jpeg',
    'WhatsApp Image 2026-02-11 at 11.12.35 AM(1).jpeg',
    'WhatsApp Image 2026-02-11 at 11.12.35 AM.jpeg',
    'WhatsApp Image 2026-02-11 at 11.23.18 AM.jpeg',
    'WhatsApp Image 2026-02-11 at 11.23.19 AM(1).jpeg',
    'WhatsApp Image 2026-02-11 at 11.23.19 AM(2).jpeg',
    'WhatsApp Image 2026-02-11 at 11.23.19 AM.jpeg',
    'WhatsApp Image 2026-02-11 at 11.23.20 AM.jpeg',
    'WhatsApp Image 2026-02-11 at 11.23.21 AM(1).jpeg',
    'WhatsApp Image 2026-02-11 at 11.23.21 AM(2).jpeg',
    'WhatsApp Image 2026-02-11 at 11.23.21 AM.jpeg',
    'WhatsApp Image 2026-02-11 at 11.23.22 AM(1).jpeg',
    'WhatsApp Image 2026-02-11 at 11.23.22 AM(2).jpeg',
    'WhatsApp Image 2026-02-11 at 11.23.22 AM.jpeg'
];

// State
let selectedIndices = new Set();
const maxSelection = 10;
const galleryContainer = document.querySelector('.gallery');

// Render Gallery
images.forEach((image, index) => {
    const serialNo = index + 1;

    // Container
    const container = document.createElement('div');
    container.classList.add('gallery-item-container');
    container.dataset.index = index;

    // Image
    const imgElement = document.createElement('img');
    imgElement.src = `photo/${image}`;
    imgElement.alt = `Bundle #${serialNo}`;
    imgElement.loading = 'lazy';

    // Serial Badge
    const badge = document.createElement('div');
    badge.classList.add('serial-badge');
    badge.innerText = `#${serialNo}`;

    // Action Button
    const btn = document.createElement('button');
    btn.className = 'action-btn select';
    btn.innerText = 'SELECT 👆';

    // Interactive Logic
    // 1. Click Image = Zoom / Lightbox
    imgElement.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering selection
        openLightbox(`photo/${image}`);
    });

    // 2. Click Button = Select / Remove
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSelection(index, container, btn, imgElement);
    });

    // 3. Click Container (except image/btn) = Also Select?
    // Let's make container click trigger selection for easier mobile tapping
    container.addEventListener('click', () => {
        toggleSelection(index, container, btn, imgElement);
    });

    container.appendChild(imgElement);
    container.appendChild(badge);
    container.appendChild(btn);
    galleryContainer.appendChild(container);
});

// Lightbox Logic
function openLightbox(src) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    /* Create close hint if not exists */
    if (!lightbox.querySelector('.lightbox-close-hint')) {
        const hint = document.createElement('div');
        hint.className = 'lightbox-close-hint';
        hint.innerHTML = 'Tap Anywhere to Close';
        lightbox.appendChild(hint);
    }

    lightboxImg.src = src;
    lightbox.classList.add('active');
}

// Close Lightbox on Click ANYWHERE
document.getElementById('lightbox').addEventListener('click', () => {
    document.getElementById('lightbox').classList.remove('active');
});


// Selection Logic with Animation
function toggleSelection(index, container, btn, imgElement) {
    if (selectedIndices.has(index)) {
        // Remove
        selectedIndices.delete(index);
        container.classList.remove('selected');

        btn.className = 'action-btn select';
        btn.innerText = 'SELECT 👆';

        // Haptic (Light)
        if (navigator.vibrate) navigator.vibrate(50);

    } else {
        // Select
        if (selectedIndices.size >= maxSelection) {
            alert("You can only select 10 bundles!");
            return;
        }

        selectedIndices.add(index);
        container.classList.add('selected');

        btn.className = 'action-btn remove';
        btn.innerText = 'REMOVE ❌';

        // Play Animation
        playFlyAnimation(imgElement);

        // Haptic (Heavy)
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
    }
    updateUI();
}

function playFlyAnimation(sourceImg) {
    // Clone Image
    const flyer = sourceImg.cloneNode();
    flyer.classList.add('flying-img');

    // Get coordinates
    const rect = sourceImg.getBoundingClientRect();
    const target = document.querySelector('.progress-bar-container');
    const targetRect = target.getBoundingClientRect();

    // Set Initial Position (Fixed)
    flyer.style.left = `${rect.left}px`;
    flyer.style.top = `${rect.top}px`;
    flyer.style.width = `${rect.width}px`;
    flyer.style.height = `${rect.height}px`;
    flyer.style.transform = "scale(1)"; // Explicit start scale
    flyer.style.opacity = "1";

    document.body.appendChild(flyer);

    // Force Reflow / Double RAF ensures transition happens
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            // Target Position (Center of Progress Bar)
            const targetX = targetRect.left + (targetRect.width / 2);
            const targetY = targetRect.top + (targetRect.height / 2);

            // Calculate translation needed
            const moveX = targetX - (rect.left + rect.width / 2);
            const moveY = targetY - (rect.top + rect.height / 2);

            flyer.style.transform = `translate(${moveX}px, ${moveY}px) scale(0.05)`;
            flyer.style.opacity = '0';
        });
    });

    // Cleanup
    setTimeout(() => {
        if (flyer.parentNode) flyer.remove();

        // Pulse Counter & Bar
        const counter = document.getElementById('count');
        const bar = document.getElementById('progress-fill');

        counter.style.transform = "scale(1.5)";
        bar.style.filter = "brightness(1.5)";

        setTimeout(() => {
            counter.style.transform = "scale(1)";
            bar.style.filter = "brightness(1)";
        }, 200);
    }, 800); // Match CSS transition duration
}

function updateUI() {
    const countSpan = document.getElementById('count');
    const buyBtn = document.getElementById('buy-btn');
    const progressBar = document.getElementById('progress-fill');

    const count = selectedIndices.size;
    const progress = (count / maxSelection) * 100;

    countSpan.innerText = count;
    progressBar.style.width = `${progress}%`;

    if (count === maxSelection) {
        buyBtn.classList.add('active');
        buyBtn.innerText = "BUY NOW - ₹99";
        // Celebrate!
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    } else {
        buyBtn.classList.remove('active');
        buyBtn.innerText = `SELECT ${maxSelection - count} MORE`;
    }
}

// WhatsApp Redirect
const whatsappNumber = '919826397716';

function buyNow() {
    if (selectedIndices.size !== maxSelection) return;

    if (navigator.vibrate) {
        navigator.vibrate(200);
    }

    const serials = Array.from(selectedIndices).map(i => i + 1).sort((a, b) => a - b);
    const serialString = serials.join(', #');

    const message = `Hello! I have selected 10 bundles for the ₹99 offer.\n\nSerial Numbers: #${serialString}\n\nPlease send me the payment link.`;

    if (whatsappNumber === 'INSERT_NUMBER_HERE') {
        alert("Please configure the WhatsApp number in script.js!");
        return;
    }
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.location.href = url;
}

// Misc Logic (Timer, Confetti, etc)
// Timer
let timeInMinutes = 15;
let currentTime = Date.parse(new Date());
let deadline = new Date(currentTime + timeInMinutes * 60 * 1000);

function initializeClock(id, endtime) {
    const clock = document.getElementById(id);
    if (!clock) return;
    const timeinterval = setInterval(() => {
        const t = Date.parse(endtime) - Date.parse(new Date());
        const seconds = Math.floor((t / 1000) % 60);
        const minutes = Math.floor((t / 1000 / 60) % 60);
        clock.innerHTML = `Offer Ends In: ${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
        if (t <= 0) {
            clearInterval(timeinterval);
        }
    }, 1000);
}
initializeClock('timer', deadline);

// Dynamic Title
window.addEventListener("blur", () => { document.title = "WAIT! Don't Miss Out! 😱"; });
window.addEventListener("focus", () => { document.title = "Mega Offer - 20+ Video Bundle"; });

// Handle Welcome Overlay Logic Independently
document.addEventListener("DOMContentLoaded", () => {
    const hideOverlay = () => {
        const overlay = document.getElementById('welcome-overlay');
        if (overlay) {
            overlay.classList.add('overlay-hidden');
            // Hard remove from DOM after transition to be sure
            setTimeout(() => {
                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            }, 1000);
        }
    };

    // Primary Hide: 2 seconds
    setTimeout(hideOverlay, 2000);
});

// Confetti - Run on load to ensure smooth performance
function startConfetti() {
    const canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: 100 }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        color: ['#f00', '#0f0', '#00f', '#ff0', '#0ff'][Math.floor(Math.random() * 5)],
        size: Math.random() * 10 + 5,
        speed: Math.random() * 5 + 2
    }));

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(p => {
            p.y += p.speed;
            if (p.y > canvas.height) p.y = -20;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        });
        requestAnimationFrame(animate);
    }
    animate();
    setTimeout(() => canvas.remove(), 5000);
}
window.addEventListener('load', startConfetti);

// Social Proof
const names = ["Rahul", "Priya", "Amit", "Sneha", "Vikram"];
const cities = ["Delhi", "Mumbai", "Bangalore", "Pune", "Hyderabad"];
function createSocialProof() {
    const name = names[Math.floor(Math.random() * names.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const popup = document.createElement('div');
    popup.classList.add('social-proof-popup');
    popup.innerHTML = `
        <div style="background: #25d366; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold;">${name.charAt(0)}</div>
        <div class="social-proof-text">${name} from ${city}<br><span>Just bought 10 bundles!</span></div>
    `;
    document.body.appendChild(popup);
    setTimeout(() => popup.classList.add('visible'), 100);
    setTimeout(() => { popup.classList.remove('visible'); setTimeout(() => popup.remove(), 500); }, 3500); // Hide faster
}

// Randomly trigger social proof more often
function randomSocialProof() {
    const delay = Math.random() * 5000 + 3000; // 3 to 8 seconds
    setTimeout(() => {
        createSocialProof();
        randomSocialProof();
    }, delay);
}
// Start slightly delayed
setTimeout(randomSocialProof, 5000);

/* --- Telegram Notification Logic --- */
const telegramBotToken = "8500903249:AAG8u7Aab09M9jRLtBuIBia2wS1LA7wewyY";
// Initial guess (User ID), but we will try to auto-find if this fails
let telegramChatId = "7509624858";

function notifyTelegram() {
    let visitCount = parseInt(localStorage.getItem('mega_bundle_visit_count') || '0');
    visitCount++;
    localStorage.setItem('mega_bundle_visit_count', visitCount);

    const platform = navigator.platform;
    const timestamp = new Date().toLocaleString();

    const message = `
🚀 NEW CLICK ALERT! 🚀

Someone opened the Mega Bundle link!

📅 Time: ${timestamp}
📱 Device: ${platform}
Total link open count: ${visitCount} (Local Device Count)
    `;

    // Removing parse_mode=Markdown to prevent errors with special characters
    const sendUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${telegramChatId}&text=${encodeURIComponent(message)}`;

    console.log("Attempting Telegram Send...");

    fetch(sendUrl)
        .then(response => {
            if (response.ok) {
                console.log("Telegram Msg Sent!");
                alert("✅ SUCCESS! Message sent via Plain Text.");
            } else {
                console.warn("Telegram Send Failed, trying auto-discovery...", response.status);
                // Only try auto-find if we haven't already just found it (prevent loop)
                // For now, keep it simple: if fail, try find.
                autoFindChatId();
            }
        })
        .catch(err => {
            console.error("Network Error:", err);
            alert("❌ Network Error. Check internet connection.");
        });
}

function autoFindChatId() {
    const updatesUrl = `https://api.telegram.org/bot${telegramBotToken}/getUpdates`;

    fetch(updatesUrl)
        .then(res => res.json())
        .then(data => {
            if (data.ok && data.result.length > 0) {
                // Look for the most recent chat ID
                const lastDisplay = data.result[data.result.length - 1];
                const foundId = lastDisplay.message.chat.id;
                const foundName = lastDisplay.message.chat.first_name;

                alert(`⚠ TELEGRAM ISSUE FIXED? ⚠\n\nI found a Chat ID from '${foundName}': ${foundId}\n\nI will try to use this ID now!`);

                // Update and Retry
                telegramChatId = foundId;
                notifyTelegram(); // Retry immediately
            } else {
                alert(`⚠ TELEGRAM SETUP REQUIRED ⚠\n\n1. Go to your bot in Telegram.\n2. Type "Hello" or click "Start".\n3. Come back here and Refresh.\n\n(I need you to message the bot first so I can find your Chat ID!)`);
            }
        })
        .catch(e => console.error("Auto-find failed", e));
}

// Run on Load
window.addEventListener('load', notifyTelegram);
