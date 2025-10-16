// Google Apps Script Code
// Copy code này vào Google Apps Script (script.google.com)

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.action === "addGameResult") {
      const gameResult = data.data;

      // Mở Google Sheets (thay SHEET_ID bằng ID của sheet của bạn)
      const sheet = SpreadsheetApp.openById(
        "1Tp3CwP24lYqfLwKqEqbrpk1g9lqDMmjOiKC9G1v2pK4"
      ).getActiveSheet();

      // Thêm dữ liệu vào sheet
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

    if (data.action === "getLeaderboard") {
      // Mở Google Sheets
      const sheet = SpreadsheetApp.openById(
        "1Tp3CwP24lYqfLwKqEqbrpk1g9lqDMmjOiKC9G1v2pK4"
      ).getActiveSheet();
      const data = sheet.getDataRange().getValues();

      sheet.getRange("A:A").setNumberFormat("dd/MM/yyyy HH:mm:ss");

      // Bỏ qua header row
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
        JSON.stringify({
          success: true,
          leaderboard: leaderboard,
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    // Mở Google Sheets
    const sheet = SpreadsheetApp.openById(
      "1Tp3CwP24lYqfLwKqEqbrpk1g9lqDMmjOiKC9G1v2pK4"
    ).getActiveSheet();
    const data = sheet.getDataRange().getValues();

    // Bỏ qua header row (nếu có)
    const leaderboard = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      // Kiểm tra nếu row không rỗng
      if (row[0] && row[1]) {
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
    }

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        leaderboard: leaderboard,
        totalRows: data.length,
        leaderboardCount: leaderboard.length,
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.log("Lỗi trong doGet:", error.toString());
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
