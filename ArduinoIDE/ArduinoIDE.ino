
#include <LiquidCrystal_I2C.h>
#include <WiFi.h>
#include <HTTPClient.h>

char* SSID="DESKTOP-IAN9182";
char* password="sauravPC";

const char* serverURL = "http://192.168.137.1:3000/saurav";

// Set the LCD dimensions
int lcdColumns = 16;
int lcdRows = 2;

int rest_time=200;

int led=4;
int BUTTON_PIN=5;

// Set LCD address, number of columns and rows
// If LCD address unknown, run I2C scanner sketch
LiquidCrystal_I2C lcd(0x27, lcdColumns, lcdRows);  

bool buzzerState = false;
bool stopRequested = false;
unsigned long buzzerStartTime = 0;
const int buzzerDuration = 60000; // 1 minute in milliseconds

// Function to scroll message on the LCD
void scrollMessage(int row, String message, int delayTime, int totalColumns) {
  for (int i = 0; i < totalColumns; i++) {
    message = " " + message;
  }
  message = message + " ";
  for (int position = 0; position < message.length(); position++) {
    lcd.setCursor(0, row);
    lcd.print(message.substring(position, position + totalColumns));
    delay(delayTime);
    // Check if the button is pressed to stop the buzzer
    if (digitalRead(BUTTON_PIN) == LOW) {
      stopRequested = true;
      digitalWrite(led, LOW);
      buzzerStartTime=0;
    }
  }
}

void setup(){
  // initialize LCD
  Serial.begin(115200);
  lcd.init();
  lcd.backlight();
  pinMode(led, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);

  WiFi.begin(SSID, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  lcd.setCursor(1, 0);
  lcd.print("Wifi Conn");
  lcd.setCursor(1, 0);
  lcd.print(WiFi.localIP());
  delay(10000);
}

void loop(){
  digitalWrite(led, LOW);
  lcd.setCursor(2, 1); // Column, Row
  // digitalWrite(led, LOW);
  delay(1000);
  lcd.clear();
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverURL); // Specify the URL

    int httpResponseCode = http.GET(); // Send the request
    
    if (httpResponseCode > 0) {
      String payload = http.getString();
      buzzerStartTime=millis();
      digitalWrite(led, HIGH);
      while(millis() - buzzerStartTime < buzzerDuration && !stopRequested){
        scrollMessage(1, payload, rest_time, lcdColumns);
      }
      stopRequested=false;
      delay(300000);
    }

    // Close connection
    http.end();
  } else {
    Serial.println("Wi-Fi not connected!");
  }
}
