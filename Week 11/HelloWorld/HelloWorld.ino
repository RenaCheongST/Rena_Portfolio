/*
  DN1010 Experimental Interaction, Rena Cheong (G02) 2026
  Week 11 - Physical Computing
  ESP32-C3 OLED
  
  Changed text display to custom text "When life gives you lemons..." and adjusted it to screen size
  Changed the typeface and a bigger font size
*/

#include <Arduino.h>
#include <U8g2lib.h>
#include <Wire.h>

#define SDA_PIN 5
#define SCL_PIN 6

U8G2_SSD1306_72X40_ER_F_HW_I2C u8g2(U8G2_R0, U8X8_PIN_NONE);

void setup(void) {
  Wire.begin(SDA_PIN, SCL_PIN);
  u8g2.begin();
}

void loop(void) {
  u8g2.clearBuffer();        
  u8g2.setFont(u8g2_font_8x13_tr); 
  u8g2.drawStr(0,10,"When life");
  u8g2.drawStr(0,25,"gives you");
  u8g2.drawStr(0,40,"lemons...");
  u8g2.sendBuffer();                  
  delay(1000);  
}