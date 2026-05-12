#include "esp_camera.h"
#include <WiFi.h>
#include <HTTPClient.h>

// =====================
// WIFI
// =====================
const char* ssid = "bhanuaxixi";
const char* password = "123456789";

// =====================
// BACKEND
// =====================
const char* uploadUrl = "http://172.20.10.3:3000/api/photo/upload";
const char* deviceKey = "ESP32_REDAKSI_12345";

// =====================
// PIN
// =====================
#define TRIGGER_PIN 13  // ✅ dari ESP32 biasa
#define FLASH_PIN 4

volatile bool takePhoto = false;

// =====================
// CAMERA CONFIG (AI THINKER)
// =====================
camera_config_t config = {
  .pin_pwdn = 32,
  .pin_reset = -1,
  .pin_xclk = 0,
  .pin_sscb_sda = 26,
  .pin_sscb_scl = 27,
  .pin_d7 = 35,
  .pin_d6 = 34,
  .pin_d5 = 39,
  .pin_d4 = 36,
  .pin_d3 = 21,
  .pin_d2 = 19,
  .pin_d1 = 18,
  .pin_d0 = 5,
  .pin_vsync = 25,
  .pin_href = 23,
  .pin_pclk = 22,
  .xclk_freq_hz = 20000000,
  .ledc_timer = LEDC_TIMER_0,
  .ledc_channel = LEDC_CHANNEL_0,
  .pixel_format = PIXFORMAT_JPEG,
  .frame_size = FRAMESIZE_VGA,
  .jpeg_quality = 12,
  .fb_count = 2
};

// =====================
// INTERRUPT
// =====================
void IRAM_ATTR onTrigger() {
  takePhoto = true;
}

// =====================
// SETUP
// =====================
void setup() {
  Serial.begin(115200);

  Serial.print("[CAM] Reset reason: ");
  Serial.println(esp_reset_reason());

  pinMode(TRIGGER_PIN, INPUT_PULLDOWN);  // ✅ siap terima trigger
  pinMode(FLASH_PIN, OUTPUT);
  digitalWrite(FLASH_PIN, LOW);

  // ✅ Interrupt dari ESP32 biasa
  attachInterrupt(digitalPinToInterrupt(TRIGGER_PIN), onTrigger, RISING);

  // WIFI
  Serial.println("[CAM] Connecting WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("[CAM] WiFi Connected");
  Serial.print("[CAM] IP: ");
  Serial.println(WiFi.localIP());

  // CAMERA
  if (esp_camera_init(&config) != ESP_OK) {
    Serial.println("[CAM] Init failed");
    while (true) {
      digitalWrite(FLASH_PIN, HIGH);
      delay(100);
      digitalWrite(FLASH_PIN, LOW);
      delay(100);
    }
  }

  sensor_t* s = esp_camera_sensor_get();
  if (s != NULL) {
    s->set_brightness(s, 1);                  // Naikkan brightness (range: -2 sampai 2)
    s->set_contrast(s, 1);                    // Naikkan contrast agar gambar lebih tajam (range: -2 sampai 2)
    s->set_saturation(s, 0);                  // Saturasi normal (range: -2 sampai 2)
    s->set_gainceiling(s, (gainceiling_t)4);  // Naikkan batas ISO/Gain agar lebih sensitif cahaya
    s->set_aec2(s, 1);                        // Aktifkan Auto Exposure tambahan
    s->set_awb_gain(s, 1);                    // Aktifkan Auto White Balance
  }

  Serial.println("[CAM] Ready, menunggu trigger dari ESP32...");
}

// =====================
// LOOP
// =====================
void loop() {
  if (takePhoto) {
    takePhoto = false;
    captureAndUpload();
  }
}

// =====================
// CAPTURE & UPLOAD
// =====================
void captureAndUpload() {
  Serial.println("[CAM] Memulai capture...");
  // 1. Nyalakan flash terlebih dahulu
  digitalWrite(FLASH_PIN, HIGH);
  delay(200);  // Tunggu sebentar agar daya LED stabil
  // Buang frame untuk kalibrasi exposure
  for (int i = 0; i < 5; i++) {
    camera_fb_t* tmp = esp_camera_fb_get();
    if (tmp) esp_camera_fb_return(tmp);
    delay(100);
  }

  // Nyalain flash, capture, matiin flash
  digitalWrite(FLASH_PIN, HIGH);
  delay(400);
  camera_fb_t* fb = esp_camera_fb_get();
  digitalWrite(FLASH_PIN, LOW);

  if (!fb) {
    Serial.println("[CAM] Capture gagal!");
    return;
  }

  Serial.print("[CAM] Ukuran gambar: ");
  Serial.print(fb->len);
  Serial.println(" bytes");

  // Cek WiFi sebelum upload
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[CAM] WiFi putus, reconnecting...");
    WiFi.reconnect();
    int retry = 0;
    while (WiFi.status() != WL_CONNECTED && retry < 20) {
      delay(300);
      retry++;
    }
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("[CAM] Gagal reconnect, skip upload");
      esp_camera_fb_return(fb);
      return;
    }
  }

  Serial.println("[CAM] Uploading...");
  HTTPClient http;
  http.begin(uploadUrl);
  http.setTimeout(10000);
  http.addHeader("Content-Type", "image/jpeg");
  http.addHeader("x-device-key", deviceKey);

  int code = http.POST(fb->buf, fb->len);
  Serial.print("[CAM] Upload status: ");
  Serial.println(code);

  if (code == 200) {
    Serial.println("[CAM] Upload berhasil!");
  } else {
    Serial.println("[CAM] Upload gagal, cek server/jaringan");
  }

  esp_camera_fb_return(fb);
  http.end();

  Serial.println("[CAM] Selesai, menunggu trigger berikutnya...");
}