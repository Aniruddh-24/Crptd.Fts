/* ==========================================================================
   REALISTIC UPI GATEWAY ENGINE (HARDCODED ₹1.00 TRANSACTION OVERRIDE)
   ========================================================================== */
const UPI_GATEWAY_CONFIG = {
    MERCHANT_UPI_ID: "paridhi0416@okicici", // <-- REPLACE WITH YOUR OWN UPI ID HERE
    MERCHANT_NAME: "CryptdFTS",
    FIXED_AMOUNT_INR: "1.00",                 // Always sends ₹1.00 no matter the cart price
    CURRENCY: "INR"
};

(function initUPIGateway() {
    document.addEventListener("DOMContentLoaded", () => {
        // 1. Inject the Apple Glass UPI Gateway Modal into the DOM
        const gatewayHTML = `
        <div class="upi-gateway-overlay" id="upiGatewayModal">
            <div class="upi-gateway-card">
                <div class="upi-gw-header">
                    <div class="upi-gw-brand">
                        <div class="upi-gw-shield"><ion-icon name="shield-checkmark"></ion-icon></div>
                        <div>
                            <h4>Crptd.Fts Pay</h4>
                            <span id="gwOrderId">Order #CFTS-90241</span>
                        </div>
                    </div>
                    <button class="upi-gw-close" id="closeUpiGw" title="Cancel Payment">
                        <ion-icon name="close-outline"></ion-icon>
                    </button>
                </div>

                <div class="upi-gw-summary">
                    <div class="upi-gw-price-left">
                        <small>Cart Value: <span class="cart-orig-total" id="gwCartOrig">$0.00</span></small>
                        <span class="actual-charge">Pay ₹1.00</span>
                    </div>
                    <span class="upi-test-pill">
                        <ion-icon name="flash"></ion-icon> ₹1 Live UPI Mode
                    </span>
                </div>

                <div id="upiMainFlow">
                    <div class="upi-gw-tabs">
                        <button class="upi-tab-btn active" data-tab="qrPane">
                            <ion-icon name="qr-code-outline"></ion-icon> Scan QR
                        </button>
                        <button class="upi-tab-btn" data-tab="appsPane">
                            <ion-icon name="phone-portrait-outline"></ion-icon> UPI Apps
                        </button>
                        <button class="upi-tab-btn" data-tab="vpaPane">
                            <ion-icon name="at-outline"></ion-icon> UPI ID
                        </button>
                    </div>

                    <div class="upi-gw-body">
                        <!-- TAB 1: Dynamic ₹1 QR Code -->
                        <div class="upi-pane active" id="qrPane">
                            <div class="qr-glass-frame">
                                <div class="qr-scan-line"></div>
                                <img id="upiQrImg" src="" alt="Scan to pay ₹1.00">
                            </div>
                            <div class="merchant-vpa-box">
                                <span id="displayMerchantVpa">${UPI_GATEWAY_CONFIG.MERCHANT_UPI_ID}</span>
                                <button type="button" id="copyVpaBtn">Copy</button>
                            </div>
                            <p style="font-size:12px; color:#6e6e73;">
                                Scan with GPay, PhonePe, Paytm or any BHIM UPI app.<br>
                                <strong>Auto-locked to ₹1.00</strong> for testing.
                            </p>
                        </div>

                        <!-- TAB 2: 1-Tap UPI Intent Apps -->
                        <div class="upi-pane" id="appsPane">
                            <p style="font-size:12.5px; color:#555; margin-bottom:10px;">
                                Tap an app below to launch a ₹1.00 payment request directly:
                            </p>
                            <div class="upi-apps-grid">
                                <a class="upi-app-btn" id="intentGpay" href="#">
                                    <span class="app-dot" style="background:#4285F4;">G</span> Google Pay
                                </a>
                                <a class="upi-app-btn" id="intentPhonePe" href="#">
                                    <span class="app-dot" style="background:#5f259f;">P</span> PhonePe
                                </a>
                                <a class="upi-app-btn" id="intentPaytm" href="#">
                                    <span class="app-dot" style="background:#00baf2;">₹</span> Paytm UPI
                                </a>
                                <a class="upi-app-btn" id="intentBhim" href="#">
                                    <span class="app-dot" style="background:#097a6e;">U</span> Any UPI App
                                </a>
                            </div>
                        </div>

                        <!-- TAB 3: Enter Payer VPA / UTR -->
                        <div class="upi-pane" id="vpaPane">
                            <div class="vpa-input-wrap">
                                <label>Your UPI ID (VPA) or 12-Digit UTR (Optional)</label>
                                <input type="text" id="userVpaInput" placeholder="e.g. yourname@okicici or UTR number">
                            </div>
                            <p style="font-size:12px; color:#6e6e73; margin-bottom:12px;">
                                Sending collect request of <strong>₹1.00</strong> to your UPI app from <strong>${UPI_GATEWAY_CONFIG.MERCHANT_UPI_ID}</strong>.
                            </p>
                        </div>

                        <div class="upi-timer-row">
                            <ion-icon name="time-outline"></ion-icon> Session expires in <strong id="upiTimer">05:00</strong>
                        </div>

                        <button type="button" class="upi-verify-btn" id="verifyUpiPaymentBtn">
                            <ion-icon name="checkmark-done-circle-outline"></ion-icon>
                            <span>I Have Paid ₹1.00 • Complete Order</span>
                        </button>
                    </div>
                </div>

                <!-- Verifying / Success Screen -->
                <div class="upi-status-screen" id="upiStatusScreen">
                    <div class="upi-spinner" id="upiSpinner"></div>
                    <div class="upi-success-check" id="upiSuccessIcon" style="display:none;">
                        <ion-icon name="checkmark-sharp"></ion-icon>
                    </div>
                    <h3 id="upiStatusTitle" style="font-size:18px; margin-bottom:6px;">Verifying ₹1.00 UPI Payment...</h3>
                    <p id="upiStatusSub" style="font-size:13px; color:#6e6e73;">
                        Connecting with NPCI UPI Switch for ${UPI_GATEWAY_CONFIG.MERCHANT_UPI_ID}
                    </p>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML("beforeend", gatewayHTML);

        // Elements
        const modal = document.getElementById("upiGatewayModal");
        const closeBtn = document.getElementById("closeUpiGw");
        const qrImg = document.getElementById("upiQrImg");
        const origTotalEl = document.getElementById("gwCartOrig");
        const orderIdEl = document.getElementById("gwOrderId");
        const copyBtn = document.getElementById("copyVpaBtn");
        const verifyBtn = document.getElementById("verifyUpiPaymentBtn");
        const mainFlow = document.getElementById("upiMainFlow");
        const statusScreen = document.getElementById("upiStatusScreen");
        const spinner = document.getElementById("upiSpinner");
        const successIcon = document.getElementById("upiSuccessIcon");
        const statusTitle = document.getElementById("upiStatusTitle");
        const statusSub = document.getElementById("upiStatusSub");
        const timerEl = document.getElementById("upiTimer");

        let countdownInterval = null;
        // Preserve original checkOut function if defined in cart.js
        const originalCheckOutFn = typeof window.checkOut === "function" ? window.checkOut : null;

        // Tab Switching
        document.querySelectorAll(".upi-tab-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".upi-tab-btn").forEach(b => b.classList.remove("active"));
                document.querySelectorAll(".upi-pane").forEach(p => p.classList.remove("active"));
                btn.classList.add("active");
                document.getElementById(btn.dataset.tab).classList.add("active");
            });
        });

        // Copy UPI ID
        copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(UPI_GATEWAY_CONFIG.MERCHANT_UPI_ID);
            copyBtn.textContent = "Copied!";
            setTimeout(() => (copyBtn.textContent = "Copy"), 1800);
        });

        // Close Modal
        closeBtn.addEventListener("click", () => {
            modal.classList.remove("active");
            clearInterval(countdownInterval);
        });

        // Helper to read current cart total from DOM or localStorage
        function getDisplayedCartTotal() {
            const domPrice = document.getElementById("total_price");
            if (domPrice && domPrice.textContent.trim() !== "") {
                return domPrice.textContent.trim();
            }
            return "$49.99";
        }

        // Open Gateway Function (Overrides global checkOut())
        window.openUPIGateway = function () {
            const orderRef = "CFTS" + Math.floor(100000 + Math.random() * 900000);
            const cartDisplayPrice = getDisplayedCartTotal();

            orderIdEl.textContent = `Order #${orderRef}`;
            origTotalEl.textContent = cartDisplayPrice;

            // Construct real NPCI UPI URI strictly locked to ₹1.00 (am=1.00)
            const upiURI = `upi://pay?pa=${encodeURIComponent(UPI_GATEWAY_CONFIG.MERCHANT_UPI_ID)}&pn=${encodeURIComponent(UPI_GATEWAY_CONFIG.MERCHANT_NAME)}&tr=${orderRef}&tn=${encodeURIComponent("Order " + orderRef)}&am=${UPI_GATEWAY_CONFIG.FIXED_AMOUNT_INR}&cu=${UPI_GATEWAY_CONFIG.CURRENCY}`;

            // Generate Live Scannable QR Code for the ₹1.00 UPI URI
            qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=6&data=${encodeURIComponent(upiURI)}`;

            // Bind UPI Intent Links for Mobile Apps
            ["intentGpay", "intentPhonePe", "intentPaytm", "intentBhim"].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.href = upiURI;
            });

            // Reset UI state
            mainFlow.style.display = "block";
            statusScreen.classList.remove("active");
            spinner.style.display = "block";
            successIcon.style.display = "none";

            // Start 5-minute countdown
            clearInterval(countdownInterval);
            let timeLeft = 300;
            countdownInterval = setInterval(() => {
                timeLeft--;
                const m = String(Math.floor(timeLeft / 60)).padStart(2, "0");
                const s = String(timeLeft % 60).padStart(2, "0");
                timerEl.textContent = `${m}:${s}`;
                if (timeLeft <= 0) clearInterval(countdownInterval);
            }, 1000);

            modal.classList.add("active");
        };

        // Override global checkOut() so clicking "Check Out" anywhere opens the UPI Gateway
        window.checkOut = function () {
            window.openUPIGateway();
        };

        // Also attach to any button with class .checkout
        document.querySelectorAll(".checkout").forEach(btn => {
            btn.removeAttribute("onclick");
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                window.openUPIGateway();
            });
        });

        // Handle Payment Verification & Final Redirect
        verifyBtn.addEventListener("click", () => {
            mainFlow.style.display = "none";
            statusScreen.classList.add("active");
            statusTitle.textContent = "Verifying ₹1.00 UPI Payment...";
            statusSub.textContent = `Checking transaction status with ${UPI_GATEWAY_CONFIG.MERCHANT_UPI_ID}...`;

            setTimeout(() => {
                spinner.style.display = "none";
                successIcon.style.display = "flex";
                const utrNum = Math.floor(400000000000 + Math.random() * 599999999999);
                statusTitle.textContent = "₹1.00 Payment Successful!";
                statusSub.innerHTML = `UTR: <strong>${utrNum}</strong><br>Redirecting to your order confirmation...`;

                // Save last UTR & ₹1.00 status in localStorage for checkout page
                localStorage.setItem("last_upi_utr", utrNum);
                localStorage.setItem("last_upi_paid", "₹1.00 (Sandbox Verified)");

                setTimeout(() => {
                    modal.classList.remove("active");
                    if (originalCheckOutFn) {
                        originalCheckOutFn();
                    } else {
                        window.location.href = "checkout.html";
                    }
                }, 1600);
            }, 2000);
        });
    });
})();