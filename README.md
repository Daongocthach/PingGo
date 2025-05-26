# 📍 PingGo – Báo thức vị trí trên thiết bị di động

![image](https://github.com/user-attachments/assets/e97e9122-7517-4892-93b4-f52e8d036231)

**PingGo** là một ứng dụng mobile đơn giản được viết bằng **React Native + Expo Router**, cho phép người dùng:
- Theo dõi **vị trí hiện tại** của bản thân
- Thiết lập một **địa điểm mục tiêu**
- Nhận **thông báo hoặc âm thanh cảnh báo** khi đến gần địa điểm đó (Geo Alarm)

---

## 🚀 Tính năng chính

- 📡 Theo dõi vị trí liên tục với `expo-location`
- 📍 Đặt vị trí cần cảnh báo (thông qua bản đồ hoặc tọa độ)
- 🔔 Gửi thông báo đẩy hoặc phát âm thanh khi gần đến vị trí
- 🗺️ Giao diện bản đồ với `react-native-maps`
- 🛠️ Viết bằng **Expo SDK 52**, **React Native 0.76.7**

---

## 🧱 Công nghệ sử dụng

| Công nghệ | Mục đích |
|----------|----------|
| **React Native** | Giao diện di động cross-platform |
| **Expo Router** | Điều hướng màn hình |
| **expo-location** | Lấy vị trí hiện tại, theo dõi GPS |
| **expo-notifications** | Gửi thông báo khi gần đến vị trí |
| **react-native-maps** | Hiển thị bản đồ và chọn vị trí |
| **expo-task-manager** | Chạy background task theo dõi vị trí |
| **expo-av** | Phát âm thanh báo thức (nếu cần) |

---

## 🖥️ Yêu cầu hệ thống

- Node.js >= 18
- Expo CLI (`npm install -g expo-cli`)
- Thiết bị Android/iOS thực tế (do cần GPS)
- Tài khoản Expo để debug trên thiết bị thật

---

## ⚙️ Hướng dẫn cài đặt & chạy ứng dụng

### 1. Clone project
```bash
git clone https://github.com/Daongocthach/pinggo.git
cd pinggo
