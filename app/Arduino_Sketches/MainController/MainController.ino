#include <RF24.h>
#include <nRF24L01.h>
#include <SPI.h>

boolean gate1_Trigger = false;
boolean gate2_Trigger = 0;
boolean gate3_Trigger = 0;
boolean gate4_Trigger = 0;
boolean gate5_Trigger = 0;

RF24 radio(7,8);

const byte gate1[6] = "gate1";
const byte gate2[6] = "gate2";


void setup() {
//  radio.begin();
//  radio.openReadingPipe(1,gate1);
//  radio.openReadingPipe(1,gate2);
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  Serial.println(gate1_Trigger);
  delay(1500);
  
}

