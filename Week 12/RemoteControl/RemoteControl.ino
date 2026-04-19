/*
  DN1010 Experimental Interaction, Rena Cheong (G02) 2026
  Week 12 - Physical / Remote Computing
  ESP32-C3 Server LED Control

  Turn on/off built-in LED over web server.
  No additional components.

  Changed the text, typeface, font size and colour of button

*/


// ====== Reference Libraries ======
#include <WiFi.h>

// ====== Network Credentials ======
const char* ssid     = "ESP32-Access-rena"; // Edited personal name
const char* password = "Renacst2026"; // Edited custom password

// ====== Network Settings ======
WiFiServer server(80);
String header;         
String LED_state = "ON";

// ====== Assign LED Pin ======
#define OUTPUT_LED 8

void setup() {
  // ====== Setup Serial Monitor ======
  Serial.begin(115200);

  // ====== Setup LED ======
  pinMode(OUTPUT_LED, OUTPUT); 
  digitalWrite(OUTPUT_LED, LOW);

  // ====== Setup ESP as Access Point ======
  Serial.print("Setting AP (Access Point)…");
  WiFi.softAP(ssid, password);
  IPAddress IP = WiFi.softAPIP();
  Serial.print("IP Address: ");
  Serial.println(IP);
  server.begin();
}

void loop(){
  WiFiClient client = server.available();   
  if (client) {                           
    Serial.println("New Client");   
    String currentLine = "";
    while (client.connected()) {
      if (client.available()) {            
        char c = client.read();          
        Serial.write(c);
        header += c;
        if (c == '\n') {
          if (currentLine.length() == 0) {
            // ====== Setup Webpage ======
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println("Connection: close");
            client.println();
            
            // ====== Turn LED On/Off ======
            if (header.indexOf("GET /8/on") >= 0) {
              Serial.println("LED on");
              LED_state = "ON";
              digitalWrite(OUTPUT_LED, LOW);
            } else if (header.indexOf("GET /8/off") >= 0) {
              Serial.println("LED off");
              LED_state = "OFF";
              digitalWrite(OUTPUT_LED, HIGH);
            } 
            
            // ====== Display HTML Webpage ======
            client.println("<!DOCTYPE html><html>");
            client.println("<head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">");
            client.println("<link rel=\"icon\" href=\"data:,\">");
            
            // ====== CSS for On/Off Buttons ====== 
            client.println("<style>html { font-family: Georgia; display: inline-block; margin: 0px auto; text-align: center;}"); // Typeface
            client.println(".button { background-color: #28c99e; border: none; color: white; padding: 16px 40px;"); // When ON, colour mint
            client.println("text-decoration: none; font-size: 60px; margin: 6px; cursor: pointer;}");
            client.println(".button2 {background-color: #730606;}</style></head>"); // When OFF, colour dark red
            
            // ====== Webpage Title ======
            client.println("<body><h1>Week 11 Task!</h1>"); // Changed the text
            
            // ====== Display Current State of Button ======
            client.println("<p>LED State - " + LED_state + "</p>");
            if (LED_state=="OFF") {
              client.println("<p><a href=\"/8/on\"><button class=\"button\">ON</button></a></p>");
            } else {
              client.println("<p><a href=\"/8/off\"><button class=\"button button2\">OFF</button></a></p>");
            } 
            
            client.println(); 
            break;            
          } else {
            currentLine = "";
          }
        } else if (c != '\r') {
          currentLine += c;
        }
      }
    }
    header = "";  
    client.stop();
    Serial.println("Client disconnected.");
    Serial.println("");
  }
}