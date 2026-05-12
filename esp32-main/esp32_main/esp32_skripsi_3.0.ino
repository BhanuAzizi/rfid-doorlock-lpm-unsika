#include <WiFi.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// =====================
// WIFI
// =====================
const char* ssid = "bhanuaxixi";
const char* password = "123456789";

// =====================
// BACKEND
// =====================
const char* serverUrl = "http://172.20.10.3:3000/api/access/rfid/scan";
const char* deviceName = "ESP32_REDAKSI";
const char* deviceKey = "ESP32_REDAKSI_12345";

// =====================
// ESP32 → ESP32-CAM TRIGGER
// =====================
#define CAM_TRIGGER_PIN 27

// =====================
// RFID PIN
// =====================
#define SS_PIN 5
#define RST_PIN 4

MFRC522 mfrc522(SS_PIN, RST_PIN);

// =====================
// RELAY SOLENOID
// =====================
#define RELAY_PIN 26
#define RELAY_ACTIVE LOW
#define RELAY_OPEN_TIME 3000

// =====================
// BUZZER
// =====================
#define BUZZER_PIN 25

// =====================
// TOMBOL DALAM
// =====================
#define BUTTON_PIN 14

// =====================
// LCD I2C
// =====================
LiquidCrystal_I2C lcd(0x27, 16, 2);

// =====================
// SETUP
// =====================
void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("=== ESP32 RFID DOORLOCK START ===");

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, !RELAY_ACTIVE);

  // BUZZER
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  // TOMBOL DALAM
  pinMode(BUTTON_PIN, INPUT);
  Serial.println("[BTN] Inside button ready");

  // LCD
  Wire.begin(21, 22);
  lcd.begin();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("  RFID DOORLOCK ");
  lcd.setCursor(0, 1);
  lcd.print(" Connecting...  ");

  // WIFI
  Serial.print("[WIFI] Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\n[WIFI] CONNECTED");
  Serial.print("[WIFI] IP ESP32: ");
  Serial.println(WiFi.localIP());

  // RFID
  SPI.begin();
  mfrc522.PCD_Init();
  Serial.println("[RFID] Reader ready");

  // TRIGGER ESP32-CAM
  pinMode(CAM_TRIGGER_PIN, OUTPUT);
  digitalWrite(CAM_TRIGGER_PIN, LOW);
  Serial.println("[CAM] Trigger pin ready");

  // LCD siap
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("  RFID DOORLOCK ");
  lcd.setCursor(0, 1);
  lcd.print("  Tap kartu...  ");
}

// =====================
// LOOP
// =====================
void loop() {

  // =====================
  // CEK TOMBOL DALAM
  // =====================
  if (digitalRead(BUTTON_PIN) == HIGH) {
    Serial.println("[BTN] Inside button pressed - OPEN");

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(" BUKA DARI DALAM");
    lcd.setCursor(0, 1);
    lcd.print(" Pintu Terbuka  ");

    // Buzzer 2x beep pendek
    digitalWrite(BUZZER_PIN, HIGH); delay(100);
    digitalWrite(BUZZER_PIN, LOW);  delay(100);
    digitalWrite(BUZZER_PIN, HIGH); delay(100);
    digitalWrite(BUZZER_PIN, LOW);

    digitalWrite(RELAY_PIN, RELAY_ACTIVE);
    delay(RELAY_OPEN_TIME);
    digitalWrite(RELAY_PIN, !RELAY_ACTIVE);

    Serial.println("[BTN] SOLENOID CLOSED");

    // Kembali idle
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("  RFID DOORLOCK ");
    lcd.setCursor(0, 1);
    lcd.print("  Tap kartu...  ");

    delay(500); // debounce
    return;     // skip cek RFID di iterasi ini
  }

  // =====================
  // CEK RFID
  // =====================
  if (!mfrc522.PICC_IsNewCardPresent()) return;
  if (!mfrc522.PICC_ReadCardSerial()) return;

  String uid = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    uid += String(mfrc522.uid.uidByte[i], HEX);
    if (i < mfrc522.uid.size - 1) uid += " ";
  }
  uid.toUpperCase();

  Serial.println("\n------------------------------");
  Serial.println("[RFID] UID SCANNED: " + uid);

  // Tampil UID di LCD
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("UID:");
  lcd.setCursor(0, 1);
  lcd.print(uid);

  sendToBackend(uid);
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WIFI] LOST CONNECTION");
  }

  delay(2000);

  // Kembali idle
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("  RFID DOORLOCK ");
  lcd.setCursor(0, 1);
  lcd.print("  Tap kartu...  ");
}

// =====================
// TRIGGER ESP32-CAM
// =====================
void triggerCamera() {
  Serial.println("[CAM] Triggering ESP32-CAM");
  digitalWrite(CAM_TRIGGER_PIN, HIGH);
  delay(50);
  digitalWrite(CAM_TRIGGER_PIN, LOW);
}

// =====================
// HTTP REQUEST
// =====================
void sendToBackend(String uid) {

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[ERROR] WIFI DISCONNECTED");
    return;
  }

  HTTPClient http;
  http.begin(serverUrl);

  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-device-key", deviceKey);

  String payload = "{";
  payload += "\"uid\":\"" + uid + "\",";
  payload += "\"device\":\"" + String(deviceName) + "\"";
  payload += "}";

  Serial.println("[HTTP] POST " + String(serverUrl));
  Serial.println("[HTTP] Payload: " + payload);
  Serial.println("[HTTP] Device-Key: " + String(deviceKey));

  int httpCode = http.POST(payload);

  Serial.print("[HTTP] Status Code: ");
  Serial.println(httpCode);

  String response = http.getString();
  Serial.println("[HTTP] Raw Response: " + response);

  if (httpCode == 200) {
    handleResponse(response);
  } else if (httpCode == 401) {
    Serial.println("[AUTH] DEVICE KEY INVALID / UNAUTHORIZED");
  } else if (httpCode == 404) {
    Serial.println("[ERROR] ENDPOINT NOT FOUND");
  } else if (httpCode == 500) {
    Serial.println("[ERROR] SERVER ERROR");
  } else {
    Serial.println("[ERROR] UNKNOWN HTTP ERROR");
  }

  http.end();
}

// =====================
// AMBIL NAMA DARI JSON
// =====================
String getNamaFromResponse(String response) {
  String nama = "";
  int namaStart = response.indexOf("\"nama\":\"");
  if (namaStart > 0) {
    namaStart += 8;
    int namaEnd = response.indexOf("\"", namaStart);
    nama = response.substring(namaStart, namaEnd);
  }
  if (nama.length() > 16) nama = nama.substring(0, 16);
  return nama;
}

// =====================
// HANDLE RESPONSE
// =====================
void handleResponse(String response) {
  triggerCamera();

  if (response.indexOf("\"status\":\"granted\"") > 0) {
    Serial.println("[ACCESS] GRANTED - SOLENOID OPEN");

    String nama = getNamaFromResponse(response);
    Serial.println("[ACCESS] Nama: " + nama);

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(" AKSES DITERIMA ");
    lcd.setCursor(0, 1);
    if (nama.length() > 0) {
      int padding = (16 - nama.length()) / 2;
      for (int i = 0; i < padding; i++) lcd.print(" ");
      lcd.print(nama);
    } else {
      lcd.print(" Pintu Terbuka  ");
    }

    // Buzzer granted: 2x beep pendek
    digitalWrite(BUZZER_PIN, HIGH); delay(100);
    digitalWrite(BUZZER_PIN, LOW);  delay(100);
    digitalWrite(BUZZER_PIN, HIGH); delay(100);
    digitalWrite(BUZZER_PIN, LOW);

    digitalWrite(RELAY_PIN, RELAY_ACTIVE);
    delay(RELAY_OPEN_TIME);
    digitalWrite(RELAY_PIN, !RELAY_ACTIVE);

    Serial.println("[ACCESS] SOLENOID CLOSED");

  } else if (response.indexOf("\"status\":\"denied\"") > 0) {
    Serial.println("[ACCESS] DENIED");

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(" AKSES DITOLAK  ");
    lcd.setCursor(0, 1);
    lcd.print(" Tidak Dikenal  ");

    // Buzzer denied: 1x beep panjang
    digitalWrite(BUZZER_PIN, HIGH); delay(500);
    digitalWrite(BUZZER_PIN, LOW);

  } else if (response.indexOf("\"mode\":\"daftar\"") > 0) {
    Serial.println("[MODE] REGISTRATION (PENDING)");

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(" MODE REGISTRASI");
    lcd.setCursor(0, 1);
    lcd.print(" Kartu Disimpan ");

    // Buzzer registrasi: 3x beep pendek
    for (int i = 0; i < 3; i++) {
      digitalWrite(BUZZER_PIN, HIGH); delay(100);
      digitalWrite(BUZZER_PIN, LOW);  delay(100);
    }

  } else {
    Serial.println("[WARN] RESPONSE FORMAT UNKNOWN");

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(" RESPONSE ERROR ");
    lcd.setCursor(0, 1);
    lcd.print("  Cek Server... ");
  }
}