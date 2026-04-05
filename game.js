// ====================== إعدادات اللعبة ======================
const CONFIG = {
    width: 1300,
    height: 750,
    gravity: 0.5,
    jumpPower: -12,
    moveSpeed: 5
};

// ====================== بيانات الفواكه (41 فاكهة كاملة) ======================
const FRUITS = {
    "Rocket": { damage: 15, abilities: ["Rocket Punch", "Rocket Blast"], rarity: "Common", color: "#ff6666" },
    "Spin": { damage: 18, abilities: ["Spin Attack", "Tornado"], rarity: "Common", color: "#66ff66" },
    "Blade": { damage: 20, abilities: ["Blade Slash", "Blade Storm"], rarity: "Common", color: "#cccccc" },
    "Spring": { damage: 22, abilities: ["Spring Jump", "Spring Cannon"], rarity: "Common", color: "#66ccff" },
    "Bomb": { damage: 25, abilities: ["Bomb Toss", "Big Bang"], rarity: "Common", color: "#ff4444" },
    "Smoke": { damage: 28, abilities: ["Smoke Screen", "Smoke Blast"], rarity: "Common", color: "#888888" },
    "Spike": { damage: 30, abilities: ["Spike Barrage", "Spike Wall"], rarity: "Common", color: "#aa8866" },
    "Flame": { damage: 45, abilities: ["Fire Ball", "Flame Pillar", "Fire Flight"], rarity: "Uncommon", color: "#ff6600" },
    "Ice": { damage: 48, abilities: ["Ice Shard", "Ice Age", "Ice Skating"], rarity: "Uncommon", color: "#66ccff" },
    "Sand": { damage: 42, abilities: ["Sand Storm", "Desert Funeral"], rarity: "Uncommon", color: "#ccaa66" },
    "Dark": { damage: 50, abilities: ["Dark Pull", "Dark Prison", "Dark Flight"], rarity: "Uncommon", color: "#663399" },
    "Light": { damage: 52, abilities: ["Light Beam", "Light Spear", "Light Flight"], rarity: "Uncommon", color: "#ffff66" },
    "Magma": { damage: 55, abilities: ["Magma Pool", "Magma Eruption", "Magma Flight"], rarity: "Uncommon", color: "#ff3300" },
    "Quake": { damage: 60, abilities: ["Quake Punch", "Earth Shatter"], rarity: "Uncommon", color: "#886600" },
    "Buddha": { damage: 80, abilities: ["Giant Punch", "Shockwave", "Buddha Form"], rarity: "Rare", color: "#ffcc66" },
    "Dough": { damage: 85, abilities: ["Dough Punch", "Dough Fist", "Dough Form"], rarity: "Rare", color: "#ffaa88" },
    "Phoenix": { damage: 75, abilities: ["Phoenix Blast", "Healing Flames", "Phoenix Form"], rarity: "Rare", color: "#ff8866" },
    "Dragon": { damage: 150, abilities: ["Dragon Breath", "Dragon Claw", "Dragon Transformation", "Dragon Storm", "Dragon Flight"], rarity: "Legendary", color: "#ff4400" },
    "Leopard": { damage: 140, abilities: ["Leopard Claw", "Leopard Dash", "Leopard Form", "Wild Hunt"], rarity: "Legendary", color: "#cc8844" },
    "Kitsune": { damage: 145, abilities: ["Fox Fire", "Kitsune Tail", "Nine Tails Form", "Mystic Flame"], rarity: "Legendary", color: "#ff99cc" },
    "Leo": { damage: 160, abilities: ["Leo Roar", "King's Claw", "Leo Form", "Royal Pride"], rarity: "Mythical", color: "#ffcc00" },
    "Yeti": { damage: 155, abilities: ["Yeti Freeze", "Ice Punch", "Yeti Form", "Snow Storm"], rarity: "Mythical", color: "#99ccff" },
    "Gas": { damage: 148, abilities: ["Gas Cloud", "Poison Gas", "Gas Form", "Explosion"], rarity: "Mythical", color: "#88ff88" }
};

// فاكهة الأدمن الخاصة
const GALAXY_FRUIT = {
    name: "Galaxy Fruit",
    damage: 999,
    abilities: {
        "1": { name: "Galactic Cloak", desc: "تختفي لمدة 5 ثواني", damage: 0 },
        "2": { name: "Star Portal", desc: "تنتقل لأي مكان", damage: 0 },
        "3": { name: "Supernova Strike", desc: "انفجار مستعر أعظم", damage: 999 },
        "4": { name: "Asteroid Rain", desc: "زخات كويكبات", damage: 750 },
        "5": { name: "Black Hole", desc: "ثقب أسود", damage: 850 },
        "6": { name: "Galaxy Flight", desc: "طيران نجمي", damage: 500 }
    },
    color: "#ff00ff"
};

// ====================== نظام تسجيل الدخول ======================
let currentUser = null;
let isAdmin = false;

const accounts = JSON.parse(localStorage.getItem("blox_accounts") || "{}");

function showError(msg) {
    const errDiv = document.getElementById("errorMsg");
    errDiv.textContent = msg;
    errDiv.style.display = "block";
    setTimeout(() => errDiv.style.display = "none", 3000);
}

document.getElementById("loginBtn").onclick = () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    
    if (!username || !password) {
        showError("✏️ أدخل اسم المستخدم وكلمة المرور");
        return;
    }
    
    if (accounts[username] && accounts[username].password === password) {
        currentUser = username;
        isAdmin = accounts[username].isAdmin || false;
        document.getElementById("loginScreen").style.display = "none";
        document.getElementById("gameScreen").style.display = "block";
        initGame();
    } else {
        showError("❌ اسم المستخدم أو كلمة المرور خطأ");
    }
};

document.getElementById("registerBtn").onclick = () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    
    if (!username || !password) {
        showError("✏️ أدخل اسم المستخدم وكلمة المرور");
        return;
    }
    
    if (accounts[username]) {
        showError("⚠️ هذا الاسم موجود بالفعل");
        return;
    }
    
    // حساب الأدمن الخاص
    const isAdminAccount = (username === "goAdmin" && password === "GalaxyMaster2024");
    
    accounts[username] = {
        password: password,
        isAdmin: isAdminAccount,
        level: isAdminAccount ? 2600 : 1,
        hp: isAdminAccount ? 25500 : 100,
        maxHp: isAdminAccount ? 25500 : 100,
        fruit: isAdminAccount ? "Galaxy Fruit" : null,
        exp: 0,
        beli: isAdminAccount ? 999999999 : 5000,
        frags: isAdminAccount ? 999999 : 0,
        ownedFruits: isAdminAccount ? Object.keys(FRUITS) : []
    };
    
    localStorage.setItem("blox_accounts", JSON.stringify(accounts));
    showError("✅ تم إنشاء الحساب! سجل دخول الآن");
};

// ====================== إعدادات اللعبة ======================
let canvas, ctx;
let player = {
    x: 400, y: 500,
    vx: 0, vy: 0,
    width: 40, height: 50,
    onGround: true,
    facingRight: true,
    level: 1,
    hp: 100,
    maxHp: 100,
    fruit: null,
    exp: 0,
    beli: 5000,
    frags: 0,
    ownedFruits: []
};

let enemies = [];
let keys = {};
let otherPlayers = {};
let chatMessages = [];
let roomId = null;
let socket = null;

// ====================== نظام اللوبيات ======================
function generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function getInviteLink() {
    const url = new URL(window.location.href);
    if (roomId) {
        url.searchParams.set("room", roomId);
    }
    return url.toString();
}

function copyInviteLink() {
    const link = getInviteLink();
    navigator.clipboard.writeText(link);
    addChatMessage("🔗 تم نسخ رابط الدعوة!", "#FFD700");
}

// ====================== نظام الشات ======================
function addChatMessage(msg, color = "#ddd") {
    chatMessages.push({ msg, color, time: Date.now() });
    if (chatMessages.length > 50) chatMessages.shift();
    
    const container = document.getElementById("chatMessages");
    container.innerHTML = "";
    chatMessages.slice(-20).forEach(m => {
        const div = document.createElement("div");
        div.innerHTML = m.msg;
        div.style.color = m.color;
        container.appendChild(div);
    });
    container.scrollTop = container.scrollHeight;
}

function sendChat() {
    const input = document.getElementById("chatInput");
    const msg = input.value.trim();
    if (!msg) return;
    
    addChatMessage(`🧑 ${currentUser}: ${msg}`, "#aaa");
    input.value = "";
    
    // إرسال للسيرفر لو موجود
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "chat", message: msg, user: currentUser }));
    }
}

document.getElementById("sendChat").onclick = sendChat;
document.getElementById("chatInput").onkeypress = (e) => {
    if (e.key === "Enter") sendChat();
};

// ====================== نظام القتال ======================
function spawnEnemy() {
    const levelMultiplier = Math.floor(player.level / 50) + 1;
    const enemyTypes = [
        { name: "Bandit", baseHp: 50, baseDamage: 10, exp: 50, color: "#8B4513" },
        { name: "Pirate", baseHp: 80, baseDamage: 15, exp: 80, color: "#A0522D" },
        { name: "Marine", baseHp: 120, baseDamage: 20, exp: 120, color: "#4169E1" },
        { name: "Sky Warrior", baseHp: 200, baseDamage: 30, exp: 200, color: "#87CEEB" },
        { name: "Dragon Knight", baseHp: 500, baseDamage: 60, exp: 500, color: "#FF4500" }
    ];
    
    const type = enemyTypes[Math.min(Math.floor(player.level / 500), enemyTypes.length - 1)];
    
    enemies.push({
        x: Math.random() * (CONFIG.width - 50) + 25,
        y: CONFIG.height - 100,
        width: 40, height: 50,
        hp: type.baseHp * levelMultiplier,
        maxHp: type.baseHp * levelMultiplier,
        damage: type.baseDamage * levelMultiplier,
        exp: type.exp * levelMultiplier,
        name: type.name,
        color: type.color,
        vx: (Math.random() - 0.5) * 2
    });
}

function attackEnemy(enemyIndex) {
    const enemy = enemies[enemyIndex];
    const damage = calculateDamage();
    enemy.hp -= damage;
    
    // تأثير الضربة
    addChatMessage(`💥 ضربت ${enemy.name} بـ ${damage} دمج!`, "#FFD700");
    
    if (enemy.hp <= 0) {
        const expGain = enemy.exp;
        player.exp += expGain;
        player.beli += enemy.exp * 10;
        addChatMessage(`🎉 هزمت ${enemy.name}! +${expGain} خبرة`, "#00FF00");
        
        enemies.splice(enemyIndex, 1);
        
        // رفع المستوى
        while (player.exp >= player.level * 100) {
            player.exp -= player.level * 100;
            player.level++;
            player.maxHp = 100 + (player.level - 1) * 10;
            player.hp = player.maxHp;
            addChatMessage(`🎉🎉🎉 ترقية! المستوى ${player.level} 🎉🎉🎉`, "#FFD700");
            
            // فرصة للحصول على فاكهة
            if (Math.random() < 0.1 && !player.fruit) {
                const fruits = Object.keys(FRUITS);
                const newFruit = fruits[Math.floor(Math.random() * fruits.length)];
                player.fruit = { ...FRUITS[newFruit], name: newFruit };
                if (!player.ownedFruits.includes(newFruit)) {
                    player.ownedFruits.push(newFruit);
                }
                addChatMessage(`🍎 مبروك! حصلت على فاكهة ${newFruit}!`, "#FF6600");
                updateSkillsUI();
            }
        }
        
        updatePlayerUI();
    }
}

function calculateDamage() {
    let damage = player.level * 10;
    if (player.fruit) {
        damage += player.fruit.damage;
    }
    return damage + Math.floor(Math.random() * 30);
}

// ====================== الحركة والفيزياء ======================
function updateMovement() {
    // WASD movement
    if (keys["ArrowLeft"] || keys["a"]) {
        player.vx = -CONFIG.moveSpeed;
        player.facingRight = false;
    } else if (keys["ArrowRight"] || keys["d"]) {
        player.vx = CONFIG.moveSpeed;
        player.facingRight = true;
    } else {
        player.vx *= 0.9;
    }
    
    // قفز
    if ((keys["ArrowUp"] || keys["w"] || keys[" "]) && player.onGround) {
        player.vy = CONFIG.jumpPower;
        player.onGround = false;
    }
    
    // جاذبية
    player.vy += CONFIG.gravity;
    player.x += player.vx;
    player.y += player.vy;
    
    // حدود
    if (player.x < 20) player.x = 20;
    if (player.x > CONFIG.width - 50) player.x = CONFIG.width - 50;
    
    if (player.y > CONFIG.height - 80) {
        player.y = CONFIG.height - 80;
        player.vy = 0;
        player.onGround = true;
    }
    if (player.y < 50) player.y = 50;
}

// ====================== الرسم ======================
function draw() {
    if (!ctx) return;
    
    // الأرض
    ctx.fillStyle = "#2d5a2d";
    ctx.fillRect(0, CONFIG.height - 60, CONFIG.width, 60);
    ctx.fillStyle = "#3d6a3d";
    for (let i = 0; i < 20; i++) {
        ctx.fillRect(i * 70, CONFIG.height - 65, 30, 10);
    }
    
    // لاعبين آخرين
    for (let id in otherPlayers) {
        const p = otherPlayers[id];
        ctx.fillStyle = "#4a90d9";
        ctx.fillRect(p.x, p.y, 40, 50);
        ctx.fillStyle = "white";
        ctx.font = "12px Arial";
        ctx.fillText(p.name, p.x, p.y - 5);
    }
    
    // اللاعب الرئيسي
    ctx.fillStyle = isAdmin ? "#ffcc00" : (player.fruit ? FRUITS[player.fruit.name]?.color || "#ff6600" : "#4a90d9");
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // تفاصيل اللاعب
    ctx.fillStyle = "#f5c542";
    ctx.fillRect(player.x + 10, player.y - 10, 20, 10);
    ctx.fillStyle = "white";
    ctx.font = "bold 14px Arial";
    ctx.fillText(currentUser, player.x, player.y - 15);
    
    if (player.fruit) {
        ctx.fillStyle = "#FFD700";
        ctx.font = "12px Arial";
        ctx.fillText(`🍎 ${player.fruit.name}`, player.x, player.y - 30);
    }
    
    // الأعداء
    enemies.forEach(e => {
        ctx.fillStyle = e.color;
        ctx.fillRect(e.x, e.y, e.width, e.height);
        ctx.fillStyle = "#fff";
        ctx.font = "10px Arial";
        ctx.fillText(e.name, e.x, e.y - 5);
        
        // شريط الصحة
        const hpPercent = e.hp / e.maxHp;
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(e.x, e.y - 12, 40, 5);
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(e.x, e.y - 12, 40 * hpPercent, 5);
    });
}

// ====================== تحديث واجهة المستخدم ======================
function updatePlayerUI() {
    document.getElementById("level").textContent = player.level;
    document.getElementById("hp").textContent = Math.floor(player.hp);
    document.getElementById("maxHp").textContent = player.maxHp;
}

function updateSkillsUI() {
    const container = document.getElementById("skillsList");
    container.innerHTML = "";
    
    if (player.fruit) {
        if (player.fruit.name === "Galaxy Fruit") {
            for (let key in GALAXY_FRUIT.abilities) {
                const skill = GALAXY_FRUIT.abilities[key];
                const btn = document.createElement("div");
                btn.className = "skill-btn";
                btn.innerHTML = `[${key}] ${skill.name}<br><small>${skill.desc}</small>`;
                btn.onclick = () => useGalaxySkill(key);
                container.appendChild(btn);
            }
        } else {
            player.fruit.abilities.forEach((ability, i) => {
                const btn = document.createElement("div");
                btn.className = "skill-btn";
                btn.innerHTML = `[${i+1}] ${ability}`;
                btn.onclick = () => useFruitSkill(i);
                container.appendChild(btn);
            });
        }
    } else {
        container.innerHTML = '<div style="color:#aaa;text-align:center;">⚠️ ليس لديك فاكهة<br>اقتل الأعداء لتحصل على واحدة!</div>';
    }
}

function useFruitSkill(skillIndex) {
    if (!player.fruit) return;
    addChatMessage(`✨ استخدمت ${player.fruit.abilities[skillIndex]}!`, "#FFD700");
    // تأثير المهارة - دمج إضافي
    if (enemies.length > 0) {
        const damage = player.fruit.damage + 50;
        enemies[0].hp -= damage;
        addChatMessage(`💥 ضربت بـ ${damage} دمج إضافي!`, "#FF6600");
        if (enemies[0].hp <= 0) attackEnemy(0);
    }
}

function useGalaxySkill(skillKey) {
    const skill = GALAXY_FRUIT.abilities[skillKey];
    addChatMessage(`✨ ${skill.name}: ${skill.desc}`, "#FF00FF");
    
    if (skill.damage > 0 && enemies.length > 0) {
        enemies.forEach((e, i) => {
            e.hp -= skill.damage;
            if (e.hp <= 0) attackEnemy(i);
        });
    }
    
    if (skillKey === "2") {
        // بوابة - انتقال عشوائي
        player.x = Math.random() * (CONFIG.width - 100) + 50;
        player.y = CONFIG.height - 100;
    }
}

// ====================== حلقة اللعبة ======================
let lastSpawn = 0;

function gameLoop() {
    updateMovement();
    
    // توليد أعداء تلقائي
    const now = Date.now();
    if (now - lastSpawn > 3000 && enemies.length < 5) {
        spawnEnemy();
        lastSpawn = now;
    }
    
    // تحرك الأعداء
    enemies.forEach(e => {
        e.x += e.vx;
        if (e.x < 20 || e.x > CONFIG.width - 60) e.vx *= -1;
        
        // تصادم مع اللاعب
        if (Math.abs(e.x - player.x) < 50 && Math.abs(e.y - player.y) < 60) {
            const damage = e.damage;
            player.hp -= damage;
            addChatMessage(`😵 ${e.name} ضربك بـ ${damage} دمج!`, "#ff4444");
            updatePlayerUI();
            
            if (player.hp <= 0) {
                addChatMessage("💀 لقد مت! يتم إحيائك...", "#ff0000");
                player.hp = player.maxHp;
                player.x = CONFIG.width / 2;
                player.y = CONFIG.height - 100;
                updatePlayerUI();
            }
        }
    });
    
    draw();
    requestAnimationFrame(gameLoop);
}

// ====================== بدء اللعبة ======================
function initGame() {
    canvas = document.getElementById("gameCanvas");
    canvas.width = CONFIG.width;
    canvas.height = CONFIG.height;
    ctx = canvas.getContext("2d");
    
    // تحميل بيانات اللاعب من الحساب
    const account = accounts[currentUser];
    if (account) {
        player.level = account.level;
        player.hp = account.hp;
        player.maxHp = account.maxHp;
        player.beli = account.beli;
        player.frags = account.frags;
        player.ownedFruits = account.ownedFruits || [];
        
        if (account.fruit === "Galaxy Fruit" && isAdmin) {
            player.fruit = { ...GALAXY_FRUIT, name: "Galaxy Fruit" };
        } else if (account.fruit && FRUITS[account.fruit]) {
            player.fruit = { ...FRUITS[account.fruit], name: account.fruit };
        }
    }
    
    updatePlayerUI();
    updateSkillsUI();
    
    // توليد غرفة
    const urlParams = new URLSearchParams(window.location.search);
    const room = urlParams.get("room");
    if (room) {
        roomId = room;
        addChatMessage(`🔗 دخلت الغرفة: ${roomId}`, "#FFD700");
    } else {
        roomId = generateRoomId();
        addChatMessage(`🎮 تم إنشاء غرفة جديدة! الرابط: ${getInviteLink()}`, "#FFD700");
    }
    
    // تسجيل الدخول للأدمن
    if (isAdmin) {
        addChatMessage("👑 مرحباً أيها الأدمن! لديك صلاحيات خاصة وفاكهة المجره.", "#FFD700");
        if (!player.fruit) {
            player.fruit = { ...GALAXY_FRUIT, name: "Galaxy Fruit" };
            updateSkillsUI();
        }
    }
    
    // إعداد keyboard events
    window.addEventListener("keydown", (e) => {
        keys[e.key] = true;
        if (e.key === " " || e.key === "ArrowUp" || e.key === "w") {
            e.preventDefault();
        }
    });
    window.addEventListener("keyup", (e) => { keys[e.key] = false; });
    
    // بدء اللعبة
    gameLoop();
}

// حفظ اللاعب عند الخروج
window.addEventListener("beforeunload", () => {
    if (currentUser && accounts[currentUser]) {
        accounts[currentUser].level = player.level;
        accounts[currentUser].hp = player.hp;
        accounts[currentUser].maxHp = player.maxHp;
        accounts[currentUser].beli = player.beli;
        accounts[currentUser].frags = player.frags;
        accounts[currentUser].ownedFruits = player.ownedFruits;
        accounts[currentUser].fruit = player.fruit?.name || null;
        localStorage.setItem("blox_accounts", JSON.stringify(accounts));
    }
});
