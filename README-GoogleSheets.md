# 🌸 Hướng dẫn tích hợp Google Sheets cho Quiz 20/10

## 📋 Cách thiết lập Google Sheets để lưu kết quả

### Phương pháp 1: Sử dụng Google Apps Script (Khuyến nghị)

#### Bước 1: Tạo Google Sheets
1. Truy cập [Google Sheets](https://sheets.google.com)
2. Tạo một sheet mới
3. Đặt tên: "Quiz 20/10 Results"
4. Tạo các cột header:
   - A1: Timestamp
   - B1: Tên người chơi
   - C1: Nhân vật
   - D1: Số câu đúng
   - E1: Thời gian (giây)
   - F1: Điểm số
   - G1: Ngày chơi

#### Bước 2: Tạo Google Apps Script
1. Truy cập [Google Apps Script](https://script.google.com)
2. Tạo project mới
3. Copy code từ file `google-apps-script.js` vào editor
4. Thay `YOUR_SHEET_ID` bằng ID của Google Sheets (lấy từ URL)
5. Lưu project và đặt tên: "Quiz 20/10 API"

#### Bước 3: Deploy Google Apps Script
1. Click "Deploy" > "New deployment"
2. Chọn type: "Web app"
3. Execute as: "Me"
4. Who has access: "Anyone"
5. Click "Deploy"
6. Copy URL được tạo ra

#### Bước 4: Cập nhật code
1. Mở file `script.js`
2. Tìm dòng: `scriptUrl: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'`
3. Thay `YOUR_SCRIPT_ID` bằng URL từ bước 3
4. Đặt `enabled: true`

### Phương pháp 2: Sử dụng Google Forms (Đơn giản hơn)

#### Bước 1: Tạo Google Form
1. Truy cập [Google Forms](https://forms.google.com)
2. Tạo form mới với các câu hỏi:
   - Tên người chơi (Short answer)
   - Nhân vật (Short answer)
   - Số câu đúng (Short answer)
   - Thời gian (Short answer)
   - Điểm số (Short answer)
   - Ngày chơi (Short answer)

#### Bước 2: Lấy Form URL
1. Click "Send" trong Google Form
2. Copy link form
3. Thay đổi từ `/viewform` thành `/formResponse`

#### Bước 3: Lấy Entry IDs
1. Mở form ở chế độ edit
2. Click "Responses" > "Create Spreadsheet"
3. Mở Google Sheets được tạo
4. Vào Tools > Script Editor
5. Chạy script sau để lấy Entry IDs:

```javascript
function getEntryIds() {
  const form = FormApp.getActiveForm();
  const items = form.getItems();
  items.forEach(item => {
    console.log(item.getTitle() + ': ' + item.getId());
  });
}
```

#### Bước 4: Cập nhật code
1. Mở file `script.js`
2. Tìm function `sendToGoogleForms`
3. Thay các `entry.XXXXXXX` bằng Entry IDs từ bước 3
4. Thay `YOUR_GOOGLE_FORM_URL` bằng URL từ bước 2
5. Thay đổi `sendToGoogleSheets(newEntry)` thành `sendToGoogleForms(newEntry)` trong function `endGame()`

## 🔧 Cấu hình nâng cao

### Tùy chỉnh dữ liệu được lưu
Trong file `script.js`, bạn có thể thay đổi dữ liệu được gửi lên Google Sheets:

```javascript
const newEntry = {
    name: playerName,
    character: characters[selectedCharacter].role,
    correct: correctAnswers,
    time: totalTime,
    score: Math.max(0, score),
    date: new Date().toLocaleDateString(),
    timestamp: new Date().toISOString(),
    // Thêm các trường khác nếu cần
    device: navigator.userAgent,
    screenSize: `${screen.width}x${screen.height}`
};
```

### Tạo báo cáo tự động
Trong Google Sheets, bạn có thể tạo các công thức để:
- Tính điểm trung bình
- Xếp hạng người chơi
- Thống kê theo nhân vật
- Biểu đồ kết quả

### Ví dụ công thức Google Sheets:
```excel
=AVERAGE(F:F)  // Điểm trung bình
=COUNTIF(C:C,"Nữ doanh nhân")  // Số lần chọn nhân vật
=RANK(F2,F:F)  // Xếp hạng điểm số
```

## 🚀 Lợi ích của việc sử dụng Google Sheets

1. **Lưu trữ tập trung**: Tất cả kết quả được lưu ở một nơi
2. **Phân tích dữ liệu**: Dễ dàng tạo báo cáo và biểu đồ
3. **Chia sẻ**: Có thể chia sẻ kết quả với người khác
4. **Backup tự động**: Google tự động backup dữ liệu
5. **Truy cập từ mọi nơi**: Xem kết quả trên mọi thiết bị

## ⚠️ Lưu ý quan trọng

- Đảm bảo Google Apps Script có quyền truy cập Google Sheets
- Test kết nối trước khi deploy
- Backup dữ liệu định kỳ
- Có thể tắt tính năng này bằng cách đặt `enabled: false`

## 🎯 Kết quả mong đợi

Sau khi thiết lập, mỗi khi có người chơi hoàn thành game, dữ liệu sẽ được tự động gửi lên Google Sheets với các thông tin:
- Thời gian chơi
- Tên người chơi
- Nhân vật được chọn
- Số câu trả lời đúng
- Thời gian hoàn thành
- Điểm số
- Ngày chơi

Bạn có thể theo dõi thống kê và tạo báo cáo từ dữ liệu này! 📊


Điểm = (Số câu đúng × 100) - (Thời gian thực tế - 1200 giây)