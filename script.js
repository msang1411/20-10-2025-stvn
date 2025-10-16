// Game Data
const characters = [
  { name: "Kei", role: "Boss", avatar: "👩‍💼" },
  { name: "Emma", role: "Developer", avatar: "👩‍💻" },
  { name: "Mia", role: "Human Resource Management", avatar: "👩‍🎨" },
  { name: "Jane", role: "Project Assistant (PA)", avatar: "👩‍⚕️" },
  { name: "Annie", role: "Quality Assurance (QA)", avatar: "👩‍🚀" },
  { name: "Flora", role: "Quality Assurance (QA)", avatar: "👩‍🍳" },
  { name: "Mary", role: "Accountant", avatar: "👩‍🏫" },
  { name: "Jasmine", role: "Business Analyst (BA)", avatar: "👩‍✈️" },
  { name: "Lena", role: "Marketing", avatar: "👩‍🎤" },
];

// Shared questions (use the same 10 questions for everyone)
const SHARED_QUESTIONS = [
  {
    question: "Loài vật nào ngủ nhiều nhất trong ngày?",
    options: ["Mèo", "Koala", "Jane", "Gấu trúc"],
    correct: 1, // Koala (ngủ tới 22 giờ mỗi ngày)
  },
  {
    question: "Có bao nhiêu thành viên nam làm việc tại văn phòng STVN?",
    options: ["10", "11", "12", "13"],
    correct: 1, // Có 11 xác
  },
  {
    question: "Sinh nhật của STVN vào ngày nào?",
    options: ["08/06", "09/06", "06/08", "06/09"],
    correct: 3, // 06/09
  },
  {
    question:
      "Trong dàn nhân sự làm việc tại văn phòng STVN. Ai là thành viên Nam lớn tuổi nhất?",
    options: ["Henry", "Tee", "Alan", "Wind"],
    correct: 3, // Wind
  },
  {
    question: "Trong các thành viên sau ai là người nói nhiều nhất?",
    options: ["Savilla", "John", "Danny", "Minn"],
    correct: 0, // Savilla
  },
  {
    question:
      "Có bao nhiêu thành viên STVN cơ sở Vinh đã có vợ/chồng (không tính chị Lisa đang nghỉ)?",
    options: ["5", "6", "7", "8"],
    correct: 2, // Kei - Mia - Emma - Annie - Peter - Savilla  - Henry
  },
  {
    question: "Thành viên có số lượt đi muộn nhiều nhất trong tháng 9 là?",
    options: ["Flora", "Jane", "Neo", "John"],
    correct: 1, // jane - 8 (Flora: 5, Neo: 7, John: 3)
  },
  {
    question:
      "Bạn chạy đua, vừa vượt người đứng thứ hai. Vậy bạn đang ở vị trí thứ mấy?",
    options: ["Thứ nhất", "Thứ hai", "Thứ ba", "Không xác định"],
    correct: 1, // Thứ hai — vì bạn vừa vượt người thứ hai nên bạn thay vị trí của họ
  },
  {
    question:
      "Trên cây có 8 chú chim, John đến bắn chết một con thì trên cây còn mấy con?",
    options: ["7", "8", "1", "0"],
    correct: 3, // (Đáp án: 0 - Toàn bộ đã bay khỏi cây vì sợ)
  },
  {
    question:
      "Có bao nhiêu chữ C trong câu sau đây: “ Cơm, canh, cháo gì tớ cũng thích ăn!”",
    options: ["9", "4", "1", "0"],
    correct: 2, // 1 chữ C viết hoa
  },
];

function getCurrentQuestionData() {
  return SHARED_QUESTIONS[currentQuestion];
}

// Game State
let currentScreen = "welcome";
let selectedCharacter = 0;
let currentQuestion = 0;
let correctAnswers = 0;
let startTime = 0;
let gameTimer = null;
let questionTimer = null;
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

// Google Sheets Configuration
const GOOGLE_SHEETS_CONFIG = {
  // Thay đổi URL này thành URL của Google Sheets của bạn
  scriptUrl:
    "https://script.google.com/macros/s/AKfycbwnUx9_KjM3-SM2KTI8pnE2pMteLX-1YwpTdcNpCc6RXg9ez7muaP1p7rMDwyEr5SzZ/exec",
  // Hoặc sử dụng Google Apps Script để tạo endpoint
  enabled: true, // Đặt thành false nếu không muốn sử dụng Google Sheets
};

// DOM Elements
const screens = {
  welcome: document.getElementById("welcome-screen"),
  character: document.getElementById("character-screen"),
  game: document.getElementById("game-screen"),
  results: document.getElementById("results-screen"),
  leaderboard: document.getElementById("leaderboard-screen"),
};

// Initialize Game
document.addEventListener("DOMContentLoaded", function () {
  initializeEventListeners();
  showScreen("welcome");
});

function initializeEventListeners() {
  // Welcome screen
  document.getElementById("start-btn").addEventListener("click", function () {
    showScreen("character");
  });

  // View leaderboard from welcome screen
  document
    .getElementById("view-leaderboard-btn")
    .addEventListener("click", function () {
      showScreen("leaderboard");
      displayLeaderboard();
    });

  // Character selection
  document.querySelectorAll(".character-card").forEach((card) => {
    card.addEventListener("click", function () {
      document
        .querySelectorAll(".character-card")
        .forEach((c) => c.classList.remove("selected"));
      this.classList.add("selected");
      selectedCharacter = parseInt(this.dataset.character);
    });
  });

  // Start game when character is selected
  document.querySelectorAll(".character-card").forEach((card) => {
    card.addEventListener("click", function () {
      setTimeout(async () => {
        startGame();
      }, 500);
    });
  });

  // Results screen
  document
    .getElementById("leaderboard-btn")
    .addEventListener("click", function () {
      showScreen("leaderboard");
      displayLeaderboard();
    });

  document
    .getElementById("back-to-home-btn")
    .addEventListener("click", function () {
      showScreen("welcome");
      resetGame();
    });

  // Leaderboard screen
  document
    .getElementById("back-to-game-btn")
    .addEventListener("click", function () {
      showScreen("welcome");
    });

  // Leaderboard tabs
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".tab-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      displayLeaderboard(this.dataset.tab);
    });
  });
}

function showScreen(screenName) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[screenName].classList.add("active");
  currentScreen = screenName;
}

function startGame() {
  if (selectedCharacter === undefined) {
    alert("Vui lòng chọn nhân vật!");
    return;
  }

  showScreen("game");
  currentQuestion = 0;
  correctAnswers = 0;
  startTime = Date.now();

  // Update character info
  const character = characters[selectedCharacter];
  document.getElementById("current-character-avatar").textContent =
    character.avatar;
  document.getElementById("current-character-name").textContent =
    character.name;
  document.getElementById("current-character-role").textContent =
    character.role;

  displayQuestion();
}

function displayQuestion() {
  const questionData = getCurrentQuestionData();

  // Update question text
  document.getElementById("question-text").textContent = questionData.question;

  // Update question number
  document.getElementById("question-number").textContent = currentQuestion + 1;

  // Update progress bar
  const progress = ((currentQuestion + 1) / 10) * 100;
  document.getElementById("progress-fill").style.width = progress + "%";

  // Generate options
  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";

  questionData.options.forEach((option, index) => {
    const optionElement = document.createElement("div");
    optionElement.className = "option";
    optionElement.textContent = option;
    optionElement.addEventListener("click", function () {
      selectAnswer(index);
    });
    optionsContainer.appendChild(optionElement);
  });

  // Start timer
  startQuestionTimer();
}

function startQuestionTimer() {
  let timeLeft = 120; // 2 phút = 120 giây
  document.getElementById("timer").textContent = timeLeft;

  // Add warning class when time is low (10 giây cuối)
  if (timeLeft <= 10) {
    document.getElementById("timer").classList.add("timer-warning");
  }

  questionTimer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = timeLeft;

    if (timeLeft <= 10) {
      document.getElementById("timer").classList.add("timer-warning");
    }

    if (timeLeft <= 0) {
      clearInterval(questionTimer);
      timeUp();
    }
  }, 1000);
}

function selectAnswer(selectedIndex) {
  clearInterval(questionTimer);
  document.getElementById("timer").classList.remove("timer-warning");

  const questionData = getCurrentQuestionData();
  const options = document.querySelectorAll(".option");

  // Disable all options
  options.forEach((option) => {
    option.style.pointerEvents = "none";
  });

  // Show correct answer
  options[questionData.correct].classList.add("correct");

  // Show incorrect answer if wrong
  if (selectedIndex !== questionData.correct) {
    options[selectedIndex].classList.add("incorrect");
  } else {
    correctAnswers++;
    document.getElementById("correct-count").textContent = correctAnswers;
  }

  // Move to next question; keep 2s for Q1-9, fast on Q10
  const isLastQuestion = currentQuestion === 9;
  const nextDelayMs = isLastQuestion ? 100 : 2000;
  setTimeout(async () => {
    currentQuestion++;
    if (currentQuestion < 10) {
      displayQuestion();
    } else {
      await endGame();
    }
  }, nextDelayMs);
}

function timeUp() {
  const questionData = getCurrentQuestionData();
  const options = document.querySelectorAll(".option");

  // Disable all options
  options.forEach((option) => {
    option.style.pointerEvents = "none";
  });

  // Show correct answer
  options[questionData.correct].classList.add("correct");

  // Move to next question; keep 2s for Q1-9, fast on Q10
  const isLastQ = currentQuestion === 9;
  const delayMs = isLastQ ? 1000 : 2000;
  setTimeout(async () => {
    currentQuestion++;
    if (currentQuestion < 10) {
      displayQuestion();
    } else {
      await endGame();
    }
  }, delayMs);
}

function getFormattedNow() {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, "0");
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const y = now.getFullYear();
  const h = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  return `${d}/${m}/${y} ${h}:${min}:${s}`;
}

async function endGame() {
  const endTime = Date.now();
  const totalTime = Math.round((endTime - startTime) / 1000);
  // Tính điểm với phạt thời gian: mỗi câu có 5 giây lý tưởng
  const idealTime = correctAnswers * 5; // Thời gian lý tưởng cho số câu đúng
  const timePenalty = Math.max(0, totalTime - idealTime); // Số giây bị phạt
  const score = Math.max(0, correctAnswers * 100 - timePenalty); // Trừ 1 điểm cho mỗi giây chậm

  // Update results
  document.getElementById("final-correct").textContent = correctAnswers;
  document.getElementById("final-time").textContent = totalTime;
  document.getElementById("final-score").textContent = Math.max(0, score);

  // Add to leaderboard
  const playerName = characters[selectedCharacter].name;
  const newEntry = {
    name: playerName,
    character: characters[selectedCharacter].role,
    correct: correctAnswers,
    time: totalTime,
    score: Math.max(0, score),
    date: new Date().toLocaleDateString(),
    timestamp: getFormattedNow(),
  };

  // Lưu vào localStorage (nguồn chính)
  leaderboard.push(newEntry);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  // Gửi lên Google Sheets (backup) - không chờ, để redirect nhanh
  if (GOOGLE_SHEETS_CONFIG.enabled) {
    sendToGoogleSheets(newEntry).catch(() => {});
  }

  // Chuyển hướng đến thiệp chúc mừng thay vì hiển thị màn hình kết quả
  redirectToCelebrationCard();
}

function redirectToCelebrationCard() {
  // Mapping tên nhân vật với file HTML
  const characterFileMap = {
    Kei: "kei.html",
    Mia: "mia.html",
    Jane: "jane.html",
    Flora: "flora.html",
    Emma: "emma.html",
    Mary: "mary.html",
    Jasmine: "jasmine.html",
    Lena: "lena.html",
    Annie: "annie.html",
  };

  const characterName = characters[selectedCharacter].name;
  const celebrationFile = characterFileMap[characterName];

  if (celebrationFile) {
    // Điều hướng ngay trong cùng tab để tránh bị chặn popup và nhanh hơn
    window.location.href = celebrationFile;
  } else {
    // Fallback nếu không tìm thấy file
    showScreen("results");
  }
}

function resetGame() {
  currentQuestion = 0;
  correctAnswers = 0;
  document.getElementById("correct-count").textContent = "0";
  document.getElementById("timer").classList.remove("timer-warning");
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr; // Nếu dateStr không parse được (ví dụ "16/10/2025"), trả nguyên
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

async function displayLeaderboard(tab = "time") {
  const leaderboardList = document.getElementById("leaderboard-list");
  leaderboardList.innerHTML =
    '<div style="text-align: center; padding: 20px; color: #666;"><i class="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...</div>';

  try {
    // Lấy dữ liệu từ Google Sheets
    const leaderboardData = await getLeaderboardFromGoogleSheets();
    console.log("Dữ liệu leaderboard nhận được:", leaderboardData);

    let sortedLeaderboard = [...leaderboardData];
    console.log("Số items trong leaderboard:", sortedLeaderboard.length);

    if (tab === "time") {
      // Ưu tiên số câu đúng trước, sau đó mới đến thời gian
      sortedLeaderboard.sort((a, b) => {
        if (b.correct !== a.correct) {
          return b.correct - a.correct; // Số câu đúng nhiều hơn xếp trước
        }
        return a.time - b.time; // Nếu cùng số câu đúng, thời gian nhanh hơn xếp trước
      });
    } else {
      // Xếp hạng theo số câu sai nhiều nhất (sai nhiều xếp trước)
      sortedLeaderboard.sort((a, b) => {
        const aWrong = 10 - a.correct; // Số câu sai của A
        const bWrong = 10 - b.correct; // Số câu sai của B
        if (bWrong !== aWrong) {
          return bWrong - aWrong; // Số câu sai nhiều hơn xếp trước
        }
        return a.time - b.time; // Nếu cùng số câu sai, thời gian nhanh hơn xếp trước
      });
    }

    // Clear loading message
    leaderboardList.innerHTML = "";

    if (sortedLeaderboard.length === 0) {
      leaderboardList.innerHTML =
        '<div style="text-align: center; padding: 40px; color: #666;">Chưa có kết quả nào!</div>';
    } else {
      sortedLeaderboard.forEach((entry, index) => {
        const rank = index + 1;
        const rankIcon =
          rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "🏅";
        const cardHref = getCelebrationCardHref(entry.name);

        const leaderboardItem = document.createElement("div");
        leaderboardItem.className = `leaderboard-item rank-${rank}`;

        leaderboardItem.innerHTML = `
                    <div class="rank-wrapper">
                      <div class="rank">${rank}</div>
                      <div class="rank-icon">${rankIcon}</div>
                      <div class="player-name">${entry.name}</div>
                    </div>              
                    <div class="player-info">
                        <div class="player-stats">
                            ${entry.correct}/10 câu đúng • ${
          entry.time
        }s • ${formatDate(entry.date)}
                        </div>
                    </div>
                    <div class="player-score">
                                          <div class="score">${
                                            entry.score
                                          }</div>
                      <div class="card-col">
                          ${
                            cardHref
                              ? `<a class="card-link" href="${cardHref}" title="Xem thiệp của ${entry.name}"><i class="fa-regular fa-hand-point-right hand-anim"></i><span>Thiệp</span></a>`
                              : '<span class="card-link disabled" title="Chưa có thiệp">Thiệp</span>'
                          }
                      </div>
                    </div>
                `;

        leaderboardList.appendChild(leaderboardItem);
      });
    }
  } catch (error) {
    console.error("Lỗi trong displayLeaderboard:", error);
    leaderboardList.innerHTML =
      '<div style="text-align: center; padding: 40px; color: #f44336;">Lỗi khi tải dữ liệu: ' +
      error.message +
      "</div>";
  }
}

function getCelebrationCardHref(name) {
  const map = {
    Kei: "kei.html",
    Mia: "mia.html",
    Jane: "jane.html",
    Flora: "flora.html",
    Emma: "emma.html",
    Mary: "mary.html",
    Jasmine: "jasmine.html",
    Lena: "lena.html",
    Annie: "annie.html",
  };
  return map[name] || "";
}

// Google Sheets Integration Functions
async function sendToGoogleSheets(gameResult) {
  try {
    const response = await fetch(GOOGLE_SHEETS_CONFIG.scriptUrl, {
      method: "POST",
      mode: "no-cors", // Cần thiết cho Google Apps Script
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "addGameResult",
        data: gameResult,
      }),
    });

    console.log("Kết quả đã được gửi lên Google Sheets (no-cors mode)");
    return true;
  } catch (error) {
    console.log("Không thể gửi lên Google Sheets:", error);
    return false;
  }
}

async function getLeaderboardFromGoogleSheets() {
  try {
    // Sử dụng GET request để lấy dữ liệu
    const response = await fetch(GOOGLE_SHEETS_CONFIG.scriptUrl, {
      method: "GET",
      mode: "cors",
    });

    console.log("Response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("Dữ liệu từ Google Sheets:", data);

      // Kiểm tra nếu có leaderboard
      if (data.leaderboard && Array.isArray(data.leaderboard)) {
        console.log("Leaderboard data:", data.leaderboard);
        return data.leaderboard;
      } else {
        console.log("Không có leaderboard data hoặc không phải array");
        return [];
      }
    } else {
      console.log("Response không OK:", response.status);
    }
  } catch (error) {
    console.log("Không thể lấy dữ liệu từ Google Sheets:", error);
  }

  // Fallback về localStorage nếu không lấy được từ Google Sheets
  const localData = JSON.parse(localStorage.getItem("leaderboard")) || [];
  console.log("Sử dụng dữ liệu từ localStorage:", localData);
  return localData;
}
