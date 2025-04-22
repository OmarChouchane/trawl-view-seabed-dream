# SafeCatch – Smart Trawl Gear Uplifting System 🐟⚙️

**Combating Illegal Kiss Trawling in Tunisia with Smart Embedded Tech**

![SafeCatch Dashboard](https://github.com/user-attachments/assets/b26dbac4-c367-4b0b-973a-b89e98674967)


---

## 🌍 Project Overview

**SafeCatch** is an intelligent trawling assistant system designed to combat illegal kiss trawling along Tunisia’s coast. The system uses real-time seabed proximity sensing to **autonomously control net depth**, helping reduce seabed damage and marine bycatch.

Developed as part of the **IEEE SIGHT SDC Tech Challenge 2025**, the project combines **hardware, software, and IoT** to empower fishermen with a sustainable, affordable alternative to destructive trawling practices.

---

## 🛠️ Features

### 🔧 Hardware:
- **Ultrasonic Sensor** (e.g., JSN-SR04T): Measures distance to seabed.
- **Gyroscope (MPU6050)**: Compensates tilt for accurate seabed measurement.
- **Microcontroller (ESP32/Arduino)**: Core logic and MQTT communication.
- **Electro-Hydraulic Valve**: Automates net lifting.
- **GPS Module**: For mapping and depth memory optimization.

### 💻 Software:
- **Real-Time Dashboard** (React.js + MQTT.js)
- Live seabed distance monitoring
- Boat + net animations
- Manual/auto winch control
- GPS tracking & playback
- System alerts & maintenance logs

---

## 📊 System Architecture

```plaintext
Sensors (Ultrasonic, Gyro, GPS)
           ↓
      Microcontroller
           ↓
  MQTT ↔ Dashboard UI
           ↓
Electro-Hydraulic Winch Control
```
---

## 🚀 Getting Started

1. Clone the repo

git clone https://github.com/OmarChouchane/trawl-view-seabed-dream.git
cd trawl-view-seabed-dream

2. Dashboard (React)

cd dashboard
npm install
npm start

---
---

## 🎯 Expected Impact

🔻 85% reduction in seagrass destruction

🐠 77% reduction in bycatch

🤝 High adoption potential by small-scale fishers

---
## 🌐 Connect With Us

📬 Contact: omar.chouchane@insat.ucar.tn
🌐 LinkedIn: Omar Chouchane



