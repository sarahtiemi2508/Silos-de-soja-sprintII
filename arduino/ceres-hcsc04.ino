// Adicionando a biblioteca
#include "Ultrasonic.h"

// Adiciona em que porta esta o pino de "gatilho"
const int PINO_TRIGGER = 12;
// Pino de retorno
const int PINO_ECHO = 13;

Ultrasonic ultrasonic1(12, 13);

void setup () {
  Serial.begin(9600);
}

void loop () {
  // Vamos simular um valor digital (0 ou 1) e mandar a distância como analógico
  int valorDigital = 1; 
  float distancia = ultrasonic1.distanceRead();

  Serial.print(valorDigital);
  Serial.print(";");
  Serial.println(distancia);

  delay(1000);
}
