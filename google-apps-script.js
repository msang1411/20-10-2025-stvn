function doPost(e) {
  try {
    let action; // Hành động client gửi: addGameResult / getLeaderboard
    let gameResult; // Dữ liệu game nếu addGameResult

    // 1️⃣ Kiểm tra kiểu dữ liệu gửi lên
    if (e.postData.type === "application/json") {
      // Android / PC gửi JSON chuẩn
      const data = JSON.parse(e.postData.contents);
      action = data.action;
      gameResult = data.data;
    } else {
      // iOS gửi form-urlencoded
      // Ở iOS, mỗi field được gửi riêng trong e.parameter
      action = e.parameter.action;
      if (action === "addGameResult") {
        gameResult = {
          timestamp: e.parameter.timestamp, // ISO string
          name: e.parameter.name,
          character: e.parameter.character,
          correct: parseInt(e.parameter.correct), // Ép kiểu số
          time: parseInt(e.parameter.time),
          score: parseInt(e.parameter.score),
          date: e.parameter.date,
        };
      }
    }

    // 2️⃣ Mở Google Sheets
    const sheet = SpreadsheetApp.openById(
      "1Tp3CwP24lYqfLwKqEqbrpk1g9lqDMmjOiKC9G1v2pK4"
    ).getActiveSheet();

    // 3️⃣ Xử lý addGameResult
    if (action === "addGameResult") {
      // Append trực tiếp ISO string → giữ nguyên định dạng
      sheet.appendRow([
        gameResult.timestamp,
        gameResult.name,
        gameResult.character,
        gameResult.correct,
        gameResult.time,
        gameResult.score,
        gameResult.date,
      ]);

      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          message: "Dữ liệu đã được lưu thành công",
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // 4️⃣ Xử lý getLeaderboard
    if (action === "getLeaderboard") {
      const data = sheet.getDataRange().getValues();
      const leaderboard = [];
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        leaderboard.push({
          timestamp: row[0],
          name: row[1],
          character: row[2],
          correct: row[3],
          time: row[4],
          score: row[5],
          date: row[6],
        });
      }

      return ContentService.createTextOutput(
        JSON.stringify({ success: true, leaderboard: leaderboard })
      ).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
