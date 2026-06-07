// =========================================================================
// 1. REAL FIREBASE CLIENT DATABASE SETUP
// =========================================================================
// NOTE: Jab hum agle step me Firebase live karenge, tab hume ye keys change karni hongi.
const firebaseConfig = {
    apiKey: "PLACEHOLDER_KEY",
    authDomain: "PLACEHOLDER_AUTH",
    projectId: "PLACEHOLDER_PROJECT_ID",
    storageBucket: "PLACEHOLDER_STORAGE",
    messagingSenderId: "PLACEHOLDER_MESSAGING",
    appId: "PLACEHOLDER_APP_ID"
};

// Initialize Engine Context
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// =========================================================================
// 2. ELEMENT SELECTORS INTERFACE INTERACTION
// =========================================================================
const authScreen = document.getElementById('auth-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const authTitle = document.getElementById('auth-title');
const authUsername = document.getElementById('auth-username');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const authBtn = document.getElementById('auth-btn');
const authToggle = document.getElementById('auth-toggle');
const authError = document.getElementById('auth-error');

const displayUsername = document.getElementById('display-username');
const displayEmail = document.getElementById('display-email');
const displayCoins = document.getElementById('display-coins');
const logoutBtn = document.getElementById('logout-btn');

const canvas = document.getElementById('coinGameCanvas');
const ctx = canvas.getContext('2d');
const gameOverlay = document.getElementById('game-overlay');
const overlayHeading = document.getElementById('overlay-heading');
const overlayMessage = document.getElementById('overlay-message');
const startGameBtn = document.getElementById('start-game-btn');

const payoutMethod = document.getElementById('payout-method');
const payoutAddress = document.getElementById('payout-address');
const withdrawBtn = document.getElementById('withdraw-btn');
const payoutStatus = document.getElementById('payout-status');

// Engine Runtime State Variables
let isLoginMode = false; // System defaults to Registration Mode
let sessionUser = null;
let currentWalletCoins = 0;

// =========================================================================
// 3. SECURE AUTHENTICATION SYSTEM MECHANISM
// =========================================================================
authToggle.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    if (isLoginMode) {
        authTitle.innerText = "Login Account";
        authBtn.innerText = "Login To Account";
        authUsername.classList.add('hidden'); // Hide username on login screen
        authToggle.innerHTML = "New User? <span>Register Account Here</span>";
    } else {
        authTitle.innerText = "Create Free Account";
        authBtn.innerText = "Register & Start Earning";
        authUsername.classList.remove('hidden');
        authToggle.innerHTML = "Already have an account? <span>Login here</span>";
    }
});

authBtn.addEventListener('click', () => {
    const email = authEmail.value.trim();
    const password = authPassword.value;
    const username = authUsername.value.trim();

    if(!email || !password || (!isLoginMode && !username)) {
        authError.innerText = "Error: All validation fields are required.";
        return;
    }

    if (isLoginMode) {
        // Core Account Authentication Login Loop
        auth.signInWithEmailAndPassword(email, password)
        .catch(err => authError.innerText = "Auth Error: " + err.message);
    } else {
        // Secure Registration Protocol Sequence
        auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            // Write core record profile mapping directly into Firestore Database cluster
            return db.collection('users').doc(userCredential.user.uid).set({
                username: username,
                email: email,
                coins: 0,
                dailyCoinsClaimed: 0,
                lastClaimedDate: ""
            });
        })
        .catch(err => authError.innerText = "Registration Error: " + err.message);
    }
});

// Persistence Monitor Pipeline (Maintains State even on Page Refreshes)
auth.onAuthStateChanged(user => {
    if (user) {
        sessionUser = user;
        authScreen.classList.add('hidden');
        dashboardScreen.classList.remove('hidden');
        displayEmail.innerText = `✉️ Email: ${user.email}`;
        authError.innerText = "";
        
        // Setup Live Streaming Continuous Database Observer Hook
        db.collection('users').doc(user.uid).onSnapshot(docSnapshot => {
            if(docSnapshot.exists) {
                const data = docSnapshot.data();
                displayUsername.innerText = `👤 User: ${data.username || 'N/A'}`;
                currentWalletCoins = data.coins || 0;
                displayCoins.innerText = currentWalletCoins;
            }
        }, err => console.error("Database streaming error:", err));
    } else {
        sessionUser = null;
        dashboardScreen.classList.add('hidden');
        authScreen.classList.remove('hidden');
    }
});

logoutBtn.addEventListener('click', () => { auth.signOut(); });

// =========================================================================
// 4. REAL 2D CANVAS GAME PIPELINE IMPLEMENTATION
// =========================================================================
let gameLoopEngine;
let isEngineRunning = false;
let objectPlayer, arrayCoins, gameScore, internalTimer;

class GameBasket {
    constructor() {
        this.width = 70;
        this.height = 14;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - 35;
        this.speed = 30; // Solid responsive horizontal speed step
    }
    render() {
        ctx.fillStyle = '#10b981'; // Emerald Green Basket
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    executeMovement(direction) {
        if(direction === 'L' && this.x > 0) this.x -= this.speed;
        if(direction === 'R' && this.x < canvas.width - this.width) this.x += this.speed;
    }
}

class FallingGoldCoin {
    constructor() {
        this.x = Math.random() * (canvas.width - 24) + 12;
        this.y = 0;
        this.radius = 9;
        this.velocity = Math.random() * 2.5 + 2.5; // Physics simulation speed scalar
    }
    render() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b'; // Gold Color Coin Asset
        ctx.fill();
        ctx.closePath();
    }
    tickUpdate() {
        this.y += this.velocity;
    }
}

// Global Key Listening Process
window.addEventListener('keydown', (event) => {
    if(!isEngineRunning) return;
    if(event.key === 'ArrowLeft' || event.key === 'a') objectPlayer.executeMovement('L');
    if(event.key === 'ArrowRight' || event.key === 'd') objectPlayer.executeMovement('R');
});

// Interactive Mobile Tap Handling Setup
canvas.addEventListener('touchstart', (event) => {
    if(!isEngineRunning) return;
    const boundaryRect = canvas.getBoundingClientRect();
    const touchXCoordinate = event.touches[0].clientX - boundaryRect.left;
    if(touchXCoordinate < canvas.width / 2) objectPlayer.executeMovement('L');
    else objectPlayer.executeMovement('R');
});

function startMatchExecution() {
    objectPlayer = new GameBasket();
    arrayCoins = [];
    gameScore = 0;
    internalTimer = 45; // Defined match lifecycle window: 45 Seconds
    isEngineRunning = true;
    gameOverlay.classList.add('hidden');

    // Chrono Timer Thread
    const clockIntervalThread = setInterval(() => {
        if(internalTimer > 0 && isEngineRunning) {
            internalTimer--;
        } else {
            clearInterval(clockIntervalThread);
            terminateMatchExecution();
        }
    }, 1000);

    gameLoopEngine = setInterval(coreGameLoopProcess, 1000 / 60); // Rigid 60 FPS update matrix
}

function coreGameLoopProcess() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Interface HUD Graphics Layer
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px Arial";
    ctx.fillText(`Points: ${gameScore}`, 16, 32);
    ctx.fillText(`Timer: ${internalTimer}s`, canvas.width - 105, 32);

    objectPlayer.render();

    // Spawn Regulation Engine Trigger
    if(Math.random() < 0.04) {
        arrayCoins.push(new FallingGoldCoin());
    }

    for(let i = arrayCoins.length - 1; i >= 0; i--) {
        arrayCoins[i].tickUpdate();
        arrayCoins[i].render();

        // Mechanical Intersect Matrix (Collision)
        if (arrayCoins[i].y + arrayCoins[i].radius >= objectPlayer.y &&
            arrayCoins[i].x >= objectPlayer.x &&
            arrayCoins[i].x <= objectPlayer.x + objectPlayer.width) {
                gameScore += 10; // 10 Points Awarded per drop caught
                arrayCoins.splice(i, 1);
                continue;
        }

        // Clean memory leaks from drops clearing view boundaries
        if(arrayCoins[i].y > canvas.height) {
            arrayCoins.splice(i, 1);
        }
    }
}

// Secure Scoring Mitigation Layer
function terminateMatchExecution() {
    isEngineRunning = false;
    clearInterval(gameLoopEngine);
    
    // Core Anti-Loss Calculation: 100 Points = 1 Coin Structure
    const targetCoinsEarned = Math.floor(gameScore / 100); 

    // Integrity Validation (Max physical ceiling bounds check)
    if (gameScore > 800) {
        overlayHeading.innerText = "Security Notice ⚠️";
        overlayMessage.innerText = "System engine flag: Abnormal point acceleration detected.";
        gameOverlay.classList.remove('hidden');
        return; 
    }

    if(sessionUser && targetCoinsEarned > 0) {
        
