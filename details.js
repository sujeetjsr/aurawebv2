
// Telegram Config (Duplicated from script.js for simplicity in this prototype)
const telegramBotToken = "8500903249:AAG8u7Aab09M9jRLtBuIBia2wS1LA7wewyY";
let telegramChatId = "7509624858";

// Retrieve Order Data
const orderDataRaw = localStorage.getItem('mega_bundle_order');
if (!orderDataRaw) {
    alert("No order found! Redirecting to home.");
    window.location.href = 'index.html';
}
const orderData = JSON.parse(orderDataRaw);

// Render Summary
const summaryBox = document.getElementById('order-summary');
summaryBox.innerHTML = `
    <h3 style="margin-top:0;">Order Summary</h3>
    <p><strong>Bundles Selected:</strong> ${orderData.itemCount}</p>
    <p><strong>Selected IDs:</strong> #${orderData.selectedIds.join(', #')}</p>
    <hr>
    <p style="font-size: 1.2rem; font-weight: bold; color: #d63384;">Total Amount: ₹${orderData.totalPrice}</p>
`;

// Handle Form Submission
document.getElementById('details-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const email = document.getElementById('email').value;
    const btn = document.getElementById('next-btn');

    // Save User Details
    const userDetails = { name, whatsapp, email };
    localStorage.setItem('mega_bundle_user', JSON.stringify(userDetails));

    // Disable button
    btn.disabled = true;
    btn.innerText = "Processing...";

    // Send "Pending Payment" Notification to Telegram
    const message = `
⏳ **NEW PENDING ORDER** ⏳

👤 **Name:** ${name}
📞 **WhatsApp:** ${whatsapp}
📧 **Email:** ${email}

📦 **Bundles:** ${orderData.itemCount}
🆔 **IDs:** ${orderData.selectedIds.join(', ')}
💰 **Amount:** ₹${orderData.totalPrice}

_Waiting for payment screenshot..._
    `;

    await sendTelegramMessage(message);

    // Redirect
    window.location.href = 'payment.html';
});

async function sendTelegramMessage(text) {
    const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${telegramChatId}&text=${encodeURIComponent(text)}&parse_mode=Markdown`;

    try {
        await fetch(url);
    } catch (error) {
        console.error("Failed to send Telegram message", error);
        // We continue anyway, as the final payment step is more critical
    }
}
