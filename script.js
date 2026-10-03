// ============================
// GAME STATE MANAGEMENT
// ============================

let gameState = {
    gameName: 'Game 1',
    gameMode: null, // 'individual', 'spinner', or 'truthdare'
    teamCount: 0,
    memberCount: 0,
    teams: [],
    players: [], // For Truth or Dare
    currentTeamIndex: 0,
    currentPlayerIndex: 0,
    isSpinning: false,
    totalSpins: 0,
    winners: [], // Track all winners
    spinHistory: [],
    truthDareHistory: [] // Track truth/dare tasks
};

const colors = ['#ff006e', '#ffd60a', '#06ffa5', '#00d4ff', '#ff5e78', '#ffb703', '#8ecae6', '#219ebc'];

// Truth or Dare tasks
const truthTasks = [
    'What is your biggest fear?',
    'What is your most embarrassing moment?',
    'What is your biggest secret?',
    'Have you ever lied to your best friend?',
    'What is the most you have ever lied?',
    'What is something you have never told anyone?',
    'If you could change one thing about yourself, what would it be?',
    'What is your biggest regret?',
    'Have you ever cheated in a game?',
    'What is your biggest weakness?'
];

const dareTasks = [
    'Do 20 push-ups right now!',
    'Stand on one leg for 30 seconds!',
    'Sing a song out loud!',
    'Dance like nobody is watching!',
    'Make a silly face and hold it for 10 seconds!',
    'Do your best impression of someone in the group!',
    'Say the alphabet backwards!',
    'Do 10 jumping jacks!',
    'Tell a joke!',
    'Walk across the room like a zombie!'
];

// ============================
// PAGE NAVIGATION
// ============================

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function selectMode(mode) {
    gameState.gameMode = mode;
    
    // Update UI to show selected mode
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.closest('.mode-btn').classList.add('selected');
}

function proceedToTeamSetup() {
    const gameName = document.getElementById('gameName').value.trim();
    const teamCount = parseInt(document.getElementById('teamCount').value);
    const memberCount = parseInt(document.getElementById('memberCount').value);
    
    if (!gameState.gameMode) {
        alert('Please select a game mode first!');
        return;
    }
    
    if (!gameName) {
        alert('Please enter a game name!');
        return;
    }
    
    // Truth or Dare mode doesn't need teams
    if (gameState.gameMode === 'truthdare') {
        gameState.gameName = gameName;
        gameState.memberCount = memberCount;
        renderTruthDareInputs();
        showPage('truthDareSetupPage');
        return;
    }
    
    if (teamCount < 2 || teamCount > 10) {
        alert('Please enter between 2 and 10 teams!');
        return;
    }
    
    if (memberCount < 1 || memberCount > 20) {
        alert('Please enter between 1 and 20 members per team!');
        return;
    }
    
    gameState.gameName = gameName;
    gameState.teamCount = teamCount;
    gameState.memberCount = memberCount;
    gameState.winners = [];
    
    // Initialize teams array
    gameState.teams = Array.from({ length: teamCount }, (_, i) => ({
        name: `Team ${i + 1}`,
        members: Array.from({ length: memberCount }, (_, j) => `Member ${j + 1}`)
    }));
    
    // Render team input fields
    renderTeamInputs();
    showPage('teamSetupPage');
}

function renderTeamInputs() {
    const container = document.getElementById('teamInputsContainer');
    container.innerHTML = '';
    
    for (let i = 0; i < gameState.teamCount; i++) {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'team-input-group';
        inputGroup.innerHTML = `
            <label>Team ${i + 1}:</label>
            <input 
                type="text" 
                value="${gameState.teams[i].name}" 
                placeholder="Enter team name"
                onchange="updateTeamName(${i}, this.value)"
            >
        `;
        container.appendChild(inputGroup);
    }
}

function updateTeamName(index, name) {
    gameState.teams[index].name = name || `Team ${index + 1}`;
}

function proceedToMemberSetup() {
    // Update team names from inputs before proceeding
    const inputs = document.querySelectorAll('.team-input-group input');
    inputs.forEach((input, index) => {
        gameState.teams[index].name = input.value || `Team ${index + 1}`;
    });
    
    renderMemberInputs();
    showPage('memberSetupPage');
}

function renderMemberInputs() {
    const container = document.getElementById('memberInputsContainer');
    container.innerHTML = '';
    
    for (let i = 0; i < gameState.teamCount; i++) {
        // Add team title
        const teamTitle = document.createElement('div');
        teamTitle.className = 'member-group-title';
        teamTitle.textContent = gameState.teams[i].name;
        container.appendChild(teamTitle);
        
        // Add member inputs
        for (let j = 0; j < gameState.memberCount; j++) {
            const inputGroup = document.createElement('div');
            inputGroup.className = 'member-input-group';
            inputGroup.innerHTML = `
                <label>Member ${j + 1}:</label>
                <input 
                    type="text" 
                    value="${gameState.teams[i].members[j]}" 
                    placeholder="Enter member name"
                    onchange="updateMemberName(${i}, ${j}, this.value)"
                >
            `;
            container.appendChild(inputGroup);
        }
    }
}

function updateMemberName(teamIndex, memberIndex, name) {
    gameState.teams[teamIndex].members[memberIndex] = name || `Member ${memberIndex + 1}`;
}

function renderTruthDareInputs() {
    const container = document.getElementById('truthDareInputsContainer');
    const playerCount = parseInt(document.getElementById('playerCount').value);
    gameState.memberCount = playerCount;
    
    container.innerHTML = '';
    gameState.players = Array.from({ length: playerCount }, (_, i) => `Player ${i + 1}`);
    
    for (let i = 0; i < playerCount; i++) {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'member-input-group';
        inputGroup.innerHTML = `
            <label>Player ${i + 1}:</label>
            <input 
                type="text" 
                value="${gameState.players[i]}" 
                placeholder="Enter player name"
                onchange="updatePlayerName(${i}, this.value)"
            >
        `;
        container.appendChild(inputGroup);
    }
}

function updatePlayerName(index, name) {
    gameState.players[index] = name || `Player ${index + 1}`;
}

function goBack() {
    const currentPage = document.querySelector('.page.active').id;
    
    if (currentPage === 'memberSetupPage') {
        showPage('teamSetupPage');
    } else if (currentPage === 'truthDareSetupPage') {
        showPage('setupPage');
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        gameState.gameMode = null;
    } else if (currentPage === 'teamSetupPage') {
        showPage('setupPage');
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        gameState.gameMode = null;
    }
}

function startGame() {
    // Update member names from inputs
    const inputs = document.querySelectorAll('.member-input-group input');
    let inputIndex = 0;
    
    for (let i = 0; i < gameState.teamCount; i++) {
        for (let j = 0; j < gameState.memberCount; j++) {
            gameState.teams[i].members[j] = inputs[inputIndex].value || `Member ${j + 1}`;
            inputIndex++;
        }
    }
    
    gameState.currentTeamIndex = 0;
    gameState.totalSpins = 0;
    gameState.winners = [];
    
    initializeGamePage();
    showPage('gamePage');
}

function startTruthDareGame() {
    // Update player names from inputs
    const inputs = document.querySelectorAll('.member-input-group input');
    inputs.forEach((input, index) => {
        gameState.players[index] = input.value || `Player ${index + 1}`;
    });
    
    gameState.currentPlayerIndex = 0;
    gameState.totalSpins = 0;
    gameState.winners = [];
    gameState.truthDareHistory = [];
    
    initializeGamePage();
    showPage('gamePage');
}

function resetGame() {
    if (confirm('Are you sure you want to reset the game? Progress will be lost.')) {
        gameState = {
            gameName: 'Game 1',
            gameMode: null,
            teamCount: 0,
            memberCount: 0,
            teams: [],
            players: [],
            currentTeamIndex: 0,
            currentPlayerIndex: 0,
            isSpinning: false,
            totalSpins: 0,
            winners: [],
            spinHistory: [],
            truthDareHistory: []
        };
        
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        document.getElementById('gameName').value = 'Game 1';
        document.getElementById('teamCount').value = 2;
        document.getElementById('memberCount').value = 3;
        document.getElementById('playerCount').value = 2;
        
        showPage('setupPage');
    }
}

// ============================
// GAME PAGE INITIALIZATION
// ============================

function initializeGamePage() {
    document.getElementById('gameNameDisplay').textContent = `📌 ${gameState.gameName}`;
    
    if (gameState.gameMode === 'truthdare') {
        createTruthDareSpinner();
        showTruthDareInterface();
    } else {
        renderTeamsList();
        updateGameDisplay();
        createSpinner();
        document.getElementById('spinButton').disabled = false;
    }
    
    updateWinnerDatabase();
}

function showTruthDareInterface() {
    document.getElementById('truthDareDisplay').classList.remove('hidden');
    // Create spinner with player names
    createTruthDareSpinner();
    // Show spinner section
    showSpinnerForTruthDare();
}

function showSpinnerForTruthDare() {
    // Show the spinner section
    document.querySelector('.truth-dare-spinner-section').classList.remove('hidden');
    document.querySelector('.truth-dare-buttons').classList.add('hidden');
    document.getElementById('truthDareResult').classList.add('hidden');
}

function spinForTruthDarePlayer() {
    if (gameState.isSpinning) return;
    
    gameState.isSpinning = true;
    
    const spinner = document.getElementById('truthDareSpinner');
    const players = gameState.players;
    const itemCount = players.length;
    
    // Generate random rotation
    const extraRotations = 5 + Math.random() * 3;
    const randomOffset = Math.random() * 360;
    const totalRotation = extraRotations * 360 + randomOffset;
    
    // Calculate winner
    const normalizedRotation = totalRotation % 360;
    const segmentAngle = 360 / itemCount;
    const winnerIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % itemCount;
    
    console.log('Spinning for Truth/Dare:', totalRotation, 'Winner:', players[winnerIndex]);
    
    // Apply rotation
    spinner.style.transition = 'transform 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    spinner.style.transform = `rotate(${totalRotation}deg)`;
    
    setTimeout(() => {
        gameState.isSpinning = false;
        gameState.currentPlayerIndex = winnerIndex;
        
        // Show whose turn it is
        const selectedPlayer = gameState.players[winnerIndex];
        document.getElementById('currentPlayerDisplay').textContent = `${selectedPlayer}'s Turn!`;
        
        // Hide spinner, show truth/dare buttons
        document.querySelector('.truth-dare-spinner-section').classList.add('hidden');
        document.querySelector('.truth-dare-buttons').classList.remove('hidden');
        document.getElementById('truthDareResult').classList.add('hidden');
        
        console.log('Turn assigned to:', selectedPlayer);
    }, 3100);
}

function renderTeamsList() {
    const teamsList = document.getElementById('teamsList');
    teamsList.innerHTML = '';
    
    gameState.teams.forEach((team, index) => {
        const teamItem = document.createElement('div');
        teamItem.className = `team-item ${index === gameState.currentTeamIndex ? 'active' : ''}`;
        teamItem.textContent = team.name;
        teamItem.onclick = () => selectTeam(index);
        teamsList.appendChild(teamItem);
    });
}

function selectTeam(index) {
    gameState.currentTeamIndex = index;
    updateGameDisplay();
    createSpinner();
    renderTeamsList();
}

function updateGameDisplay() {
    const currentTeam = gameState.teams[gameState.currentTeamIndex];
    document.getElementById('currentTeamTitle').textContent = currentTeam.name;
    document.getElementById('currentTeamName').textContent = currentTeam.name;
    document.getElementById('spinCount').textContent = gameState.totalSpins;
    
    const modeDisplay = gameState.gameMode === 'individual' ? 'Individual Game' : 'Spinner Game';
    document.getElementById('modeDisplay').textContent = modeDisplay;
}

function updateWinnerDatabase() {
    const winnersList = document.getElementById('winnersList');
    winnersList.innerHTML = '';
    
    // Count winners
    const winnerCount = {};
    gameState.winners.forEach(winner => {
        winnerCount[winner] = (winnerCount[winner] || 0) + 1;
    });
    
    // Display winners
    if (Object.keys(winnerCount).length === 0) {
        winnersList.innerHTML = '<div class="winner-item">No winners yet...</div>';
    } else {
        Object.entries(winnerCount)
            .sort((a, b) => b[1] - a[1])
            .forEach(([name, count]) => {
                const item = document.createElement('div');
                item.className = 'winner-item';
                item.innerHTML = `${name}: <span class="winner-count">${count}</span>`;
                winnersList.appendChild(item);
            });
    }
}

// ============================
// SPINNER MECHANICS
// ============================

function createSpinner() {
    const spinnerOptions = document.getElementById('spinnerOptions');
    const spinner = document.getElementById('spinner');
    
    let items = [];
    
    if (gameState.gameMode === 'spinner') {
        // Spinner mode: show teams
        items = gameState.teams.map(team => team.name);
    } else {
        // Individual mode: show current team members
        const currentTeam = gameState.teams[gameState.currentTeamIndex];
        items = currentTeam.members;
    }
    
    spinnerOptions.innerHTML = '';
    const itemCount = items.length;
    
    items.forEach((item, index) => {
        const angle = (360 / itemCount) * index;
        const option = document.createElement('div');
        option.className = 'spinner-option';
        option.textContent = item;
        option.style.transform = `rotate(${angle}deg) translateY(-160px) rotate(-${angle}deg)`;
        spinnerOptions.appendChild(option);
    });
    
    // Reset spinner to initial state
    spinner.style.transition = 'none';
    spinner.style.transform = 'rotate(0deg)';
    
    // Force reflow
    void spinner.offsetHeight;
}

function spinWheel() {
    if (gameState.isSpinning) return;
    
    gameState.isSpinning = true;
    document.getElementById('spinButton').disabled = true;
    
    const spinner = document.getElementById('spinner');
    let items = [];
    
    if (gameState.gameMode === 'spinner') {
        items = gameState.teams.map(team => team.name);
    } else {
        const currentTeam = gameState.teams[gameState.currentTeamIndex];
        items = currentTeam.members;
    }
    
    const itemCount = items.length;
    
    // Generate random rotation
    const extraRotations = 5 + Math.random() * 3;
    const randomOffset = Math.random() * 360;
    const totalRotation = extraRotations * 360 + randomOffset;
    
    // Calculate winner
    const normalizedRotation = totalRotation % 360;
    const segmentAngle = 360 / itemCount;
    const winnerIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % itemCount;
    
    // Apply rotation
    spinner.style.transition = 'transform 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    spinner.style.transform = `rotate(${totalRotation}deg)`;
    
    console.log('Spinning to rotation:', totalRotation, 'Winner Index:', winnerIndex, 'Winner:', items[winnerIndex]);
    
    setTimeout(() => {
        gameState.isSpinning = false;
        document.getElementById('spinButton').disabled = false;
        gameState.totalSpins++;
        
        const winner = items[winnerIndex];
        gameState.winners.push(winner);
        
        showResult(winner);
    }, 3100);
}

function showResult(winner) {
    document.getElementById('winnerName').textContent = winner;
    document.getElementById('resultDisplay').classList.remove('hidden');
    createConfetti();
    updateWinnerDatabase();
}

function nextTurn() {
    document.getElementById('resultDisplay').classList.add('hidden');
    
    if (gameState.gameMode === 'spinner') {
        // Spinner mode: switch to next team
        gameState.currentTeamIndex = (gameState.currentTeamIndex + 1) % gameState.teamCount;
    }
    
    updateGameDisplay();
    createSpinner();
    renderTeamsList();
    document.getElementById('spinButton').disabled = false;
}

// ============================
// TRUTH OR DARE MECHANICS
// ============================

function selectTruthOrDare(choice) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    let task = '';
    
    if (choice === 'truth') {
        task = truthTasks[Math.floor(Math.random() * truthTasks.length)];
    } else {
        task = dareTasks[Math.floor(Math.random() * dareTasks.length)];
    }
    
    gameState.winners.push(`${currentPlayer} - ${choice.toUpperCase()}`);
    gameState.totalSpins++;
    
    // Hide choice buttons
    document.querySelector('.truth-dare-buttons').classList.add('hidden');
    
    // Show task with completion button
    document.getElementById('taskDisplay').textContent = task;
    document.getElementById('truthDareResult').classList.remove('hidden');
    
    // Update task completed button
    const completedBtn = document.querySelector('.btn-task-completed');
    if (!completedBtn) {
        const btn = document.createElement('button');
        btn.className = 'btn-task-completed';
        btn.textContent = '✓ Task Completed - Next Player';
        btn.onclick = nextTruthDareTurn;
        document.querySelector('.truth-dare-result').appendChild(btn);
    }
    
    updateWinnerDatabase();
}

function nextTruthDareTurn() {
    document.getElementById('truthDareResult').classList.add('hidden');
    document.querySelector('.truth-dare-buttons').classList.add('hidden');
    document.querySelector('.truth-dare-spinner-section').classList.remove('hidden');
    
    // Reset spinner
    const spinner = document.getElementById('truthDareSpinner');
    spinner.style.transition = 'none';
    spinner.style.transform = 'rotate(0deg)';
    void spinner.offsetHeight;
}

// ============================
// CONFETTI EFFECT
// ============================

function createConfetti() {
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '999';
            confetti.style.boxShadow = '0 0 10px rgba(0, 212, 255, 0.5)';
            
            document.body.appendChild(confetti);
            
            const duration = 2000 + Math.random() * 1000;
            const startTime = Date.now();
            
            function animate() {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;
                
                confetti.style.top = (window.innerHeight * progress) + 'px';
                confetti.style.opacity = 1 - progress;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    confetti.remove();
                }
            }
            
            animate();
        }, i * 30);
    }
}

// ============================
// SAVE/LOAD FUNCTIONALITY
// ============================

function saveGame() {
    const gameName = gameState.gameName;
    
    if (!gameName) {
        alert('Game name is required!');
        return;
    }
    
    const savedGames = JSON.parse(localStorage.getItem('savedGames')) || {};
    
    const gameData = {
        gameName: gameState.gameName,
        gameMode: gameState.gameMode,
        teamCount: gameState.teamCount,
        memberCount: gameState.memberCount,
        teams: gameState.teams,
        players: gameState.players,
        winners: gameState.winners,
        totalSpins: gameState.totalSpins,
        timestamp: new Date().toLocaleString()
    };
    
    savedGames[gameName] = gameData;
    localStorage.setItem('savedGames', JSON.stringify(savedGames));
    
    alert(`Game "${gameName}" saved successfully!`);
}

function loadSavedGames() {
    const savedGames = JSON.parse(localStorage.getItem('savedGames')) || {};
    const savedGamesList = document.getElementById('savedGamesList');
    
    savedGamesList.innerHTML = '';
    
    if (Object.keys(savedGames).length === 0) {
        savedGamesList.innerHTML = '<div class="saved-game-item">No saved games found</div>';
        document.getElementById('loadGameModal').classList.remove('hidden');
        return;
    }
    
    Object.entries(savedGames).forEach(([name, data]) => {
        const item = document.createElement('div');
        item.className = 'saved-game-item';
        item.innerHTML = `
            <div class="saved-game-info">
                <div class="saved-game-name">${name}</div>
                <div class="saved-game-details">
                    Mode: ${data.gameMode} | Spins: ${data.totalSpins} | Saved: ${data.timestamp}
                </div>
            </div>
            <div class="saved-game-actions">
                <button class="btn-load-game" onclick="loadGame('${name}')">Load</button>
                <button class="btn-delete-game" onclick="deleteGame('${name}')">Delete</button>
            </div>
        `;
        savedGamesList.appendChild(item);
    });
    
    document.getElementById('loadGameModal').classList.remove('hidden');
}

function loadGame(gameName) {
    const savedGames = JSON.parse(localStorage.getItem('savedGames')) || {};
    const gameData = savedGames[gameName];
    
    if (!gameData) {
        alert('Game not found!');
        return;
    }
    
    // Restore game state
    gameState = {
        gameName: gameData.gameName,
        gameMode: gameData.gameMode,
        teamCount: gameData.teamCount,
        memberCount: gameData.memberCount,
        teams: gameData.teams,
        players: gameData.players,
        currentTeamIndex: 0,
        currentPlayerIndex: 0,
        isSpinning: false,
        totalSpins: gameData.totalSpins,
        winners: gameData.winners,
        spinHistory: [],
        truthDareHistory: []
    };
    
    closeLoadModal();
    initializeGamePage();
    showPage('gamePage');
}

function deleteGame(gameName) {
    if (confirm(`Are you sure you want to delete "${gameName}"?`)) {
        const savedGames = JSON.parse(localStorage.getItem('savedGames')) || {};
        delete savedGames[gameName];
        localStorage.setItem('savedGames', JSON.stringify(savedGames));
        
        loadSavedGames();
    }
}

function closeLoadModal() {
    document.getElementById('loadGameModal').classList.add('hidden');
}

// ============================
// INITIALIZATION
// ============================

document.addEventListener('DOMContentLoaded', () => {
    showPage('setupPage');
    
    document.getElementById('gameName').value = 'Game 1';
    document.getElementById('teamCount').value = 2;
    document.getElementById('memberCount').value = 3;
    document.getElementById('playerCount').value = 2;
});

// ============================
// KEYBOARD SHORTCUTS
// ============================

document.addEventListener('keydown', (e) => {
    const currentPage = document.querySelector('.page.active').id;
    
    if (currentPage === 'gamePage' && e.code === 'Space') {
        e.preventDefault();
        if (gameState.gameMode !== 'truthdare' && !gameState.isSpinning) {
            spinWheel();
        }
    }
    
    if ((currentPage === 'setupPage' || currentPage === 'teamSetupPage') && e.key === 'Enter') {
        e.preventDefault();
        if (currentPage === 'setupPage') {
            proceedToTeamSetup();
        }
    }
});


// ============================
// TRUTH OR DARE SPINNER
// ============================

function createTruthDareSpinner() {
    const spinnerOptions = document.getElementById('truthDareSpinnerOptions');
    const spinner = document.getElementById('truthDareSpinner');
    const players = gameState.players;
    
    spinnerOptions.innerHTML = '';
    const itemCount = players.length;
    
    players.forEach((player, index) => {
        const angle = (360 / itemCount) * index;
        const option = document.createElement('div');
        option.className = 'truth-dare-spinner-option';
        option.textContent = player;
        option.style.transform = `rotate(${angle}deg) translateY(-125px) rotate(-${angle}deg)`;
        spinnerOptions.appendChild(option);
    });
    
    // Reset spinner
    spinner.style.transition = 'none';
    spinner.style.transform = 'rotate(0deg)';
    void spinner.offsetHeight;
}
