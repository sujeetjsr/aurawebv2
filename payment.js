
// Telegram Config
const telegramBotToken = "8500903249:AAG8u7Aab09M9jRLtBuIBia2wS1LA7wewyY";
let telegramChatId = "7509624858";

// Check Data
const orderDataRaw = localStorage.getItem('mega_bundle_order');
const userDataRaw = localStorage.getItem('mega_bundle_user');

if (!orderDataRaw || !userDataRaw) {
    alert("Session expired! Redirecting to home.");
    window.location.href = 'index.html';
}

const orderData = JSON.parse(orderDataRaw);
const userData = JSON.parse(userDataRaw);

// Display Data
document.getElementById('amount-text').innerText = `₹${orderData.totalPrice}`;
document.getElementById('user-name-display').innerText = userData.name;



// Handle File Input Change
// Handle File Input Change
const fileInput = document.getElementById('screenshot-upload');
const fileNameDisplay = document.getElementById('file-name-display');
const finishBtn = document.getElementById('finish-btn');

// Disable button initially
finishBtn.disabled = true;
finishBtn.style.opacity = "0.5";
finishBtn.style.cursor = "not-allowed";
finishBtn.title = "Please upload screenshot first";

fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        fileNameDisplay.textContent = `Selected: ${fileInput.files[0].name}`;
        fileNameDisplay.style.display = 'block';

        // Enable Button
        finishBtn.disabled = false;
        finishBtn.style.opacity = "1";
        finishBtn.style.cursor = "pointer";
        finishBtn.innerText = "PAYMENT DONE ✅ (Click to Submit)";
    }
});

// Handle Form Submission
document.getElementById('payment-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (fileInput.files.length === 0) {
        alert("Please upload the payment screenshot!");
        return;
    }

    const btn = document.getElementById('finish-btn');
    btn.disabled = true;
    btn.innerText = "Sending Proof...";

    const file = fileInput.files[0];
    const caption = `
✅ **PAYMENT RECEIVED** ✅

👤 **User:** ${userData.name}
📞 **Phone:** ${userData.whatsapp}
📧 **Email:** ${userData.email}
💰 **Amount:** ₹${orderData.totalPrice}

_Please verify the screenshot and fulfill the order._
    `;

    await sendTelegramPhoto(file, caption);

    // Show Success
    document.getElementById('payment-box').style.display = 'none';
    document.getElementById('success-box').style.display = 'block';

    // Clear Session (Optional, but good practice)
    // localStorage.removeItem('mega_bundle_order');
    // localStorage.removeItem('mega_bundle_user');
});

async function sendTelegramPhoto(file, caption) {
    const formData = new FormData();
    formData.append('chat_id', telegramChatId);
    formData.append('photo', file);
    formData.append('caption', caption);
    formData.append('parse_mode', 'Markdown');

    const url = `https://api.telegram.org/bot${telegramBotToken}/sendPhoto`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            console.error("Telegram Error:", await response.text());
            alert("Network error sending proof. But don't worry, we saved your order!");
        }
    } catch (error) {
        console.error("Network Error:", error);
    }
}
