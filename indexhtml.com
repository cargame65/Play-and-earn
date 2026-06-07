<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Play Zone - Earn Real Money</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- ================= 1. LOGIN & SIGNUP SCREEN ================= -->
    <div id="auth-screen" class="main-card">
        <h2 id="auth-title">Create Free Account</h2>
        <p class="subtitle">Play games, earn coins, and withdraw via UPI/PayPal/Crypto</p>
        
        <div class="input-group">
            <!-- Username fields only visible during Signup -->
            <input type="text" id="auth-username" placeholder="Choose a Unique Username" required>
            <input type="email" id="auth-email" placeholder="Enter Your Real Email Address" required>
            <input type="password" id="auth-password" placeholder="Create a Strong Password" required>
        </div>
        
        <button id="auth-btn">Register & Start Earning</button>
        <p id="auth-toggle">Already have an account? <span>Login here</span></p>
        <p id="auth-error" class="error-msg"></p>
    </div>

    <!-- ================= 2. MAIN USER DASHBOARD ================= -->
    <div id="dashboard-screen" class="main-card hidden">
        
        <!-- Top Navigation Bar -->
        <header class="user-navbar">
            <div class="user-details">
                <span id="display-username">👤 Username: Loading...</span>
                <span id="display-email">✉️ Email: Loading...</span>
            </div>
            <div class="balance-badge">
                💰 Balance: <span id="display-coins">0</span> Coins
            </div>
            <button id="logout-btn" class="danger-btn">Logout</button>
        </header>

        <!-- TOP ADSTERRA AD SLOT -->
        <div class="adsterra-slot banner-728">
            <!-- PASTE YOUR ADSTERRA 728x90 OR 320x50 BANNER CODE HERE -->
            <div class="ad-placeholder">[Adsterra Leaderboard Banner Advertisement]</div>
        </div>

        <!-- Main Layout Area -->
        <div class="dashboard-body">
            
            <!-- LEFT ADSTERRA SIDEBAR -->
            <div class="adsterra-slot sidebar-160">
                <!-- PASTE YOUR ADSTERRA 160x600 AD CODE HERE -->
                <div class="ad-placeholder">Sidebar Ad Left</div>
            </div>

            <!-- THE REAL GAME CONTAINER -->
            <div class="game-box">
                <canvas id="coinGameCanvas" width="400" height="500"></canvas>
                
                <!-- Game Screens Overlay (Start / Over / Loading) -->
                <div id="game-overlay" class="game-overlay-layer">
                    <h2 id="overlay-heading">Coin Collector 2D</h2>
                    <p id="overlay-message">Move your basket Left/Right using arrow keys or tap screen sides to catch falling gold coins.</p>
                    <button id="start-game-btn">Start Match (45s)</button>
                </div>
            </div>

            <!-- RIGHT ADSTERRA SIDEBAR -->
            <div class="adsterra-slot sidebar-160">
                <!-- PASTE YOUR ADSTERRA 160x600 AD CODE HERE -->
                <div class="ad-placeholder">Sidebar Ad Right</div>
            </div>

        </div>

        <!-- ================= 3. REAL PAYOUT / WITHDRAW SECTION ================= -->
        <section class="payout-section">
            <h3>💳 Withdraw Your Earnings</h3>
            <p class="payout-note">Minimum withdrawal limit: <b>5000 Coins (₹50 / $0.60)</b>. 100 Points = 1 Coin.</p>
            
            <div class="payout-form">
                <select id="payout-method">
                    <option value="">-- Select Payment Method --</option>
                    <option value="UPI">UPI (GPay, PhonePe, Paytm) - India Only</option>
                    <option value="PayPal">PayPal (International)</option>
                    <option value="Crypto">Crypto (USDT - TRC20)</option>
                </select>

                <input type="text" id="payout-address" placeholder="Enter UPI ID / PayPal Email / Crypto Wallet Address">
                <button id="withdraw-btn">Submit Withdrawal Request</button>
            </div>
            <p id="payout-status" class="status-msg"></p>
        </section>

    </div>

    <!-- Firebase Configuration Framework Libraries (Compat Version) -->
    <script src="https://gstatic.com"></script>
    <script src="https://gstatic.com"></script>
    <script src="https://gstatic.com"></script>

    <!-- App JavaScript Logic -->
    <script src="app.js"></script>
</body>
</html>

