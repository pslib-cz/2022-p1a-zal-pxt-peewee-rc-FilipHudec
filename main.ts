radio.setTransmitPower(7);
let radioMessage1 = 0;
let radioMessage2 = 0;
let motorSpeed = 0;

radio.onDataPacketReceived(({ receivedString }) => {

    const x = receivedString.charCodeAt(0) + 0;
    const y = receivedString.charCodeAt(1) + 0;

    const ul = Math.map(x, 0, 255, -255, 255); // přizpůsobit našim kolům
    const ur = Math.map(y, 0, 255, -215, 215);

    radioMessage1 = x;
    radioMessage2 = y;
});

function autickoJede(lw: number = 0, rw: number = 0) {
    PCAmotor.MotorRun(PCAmotor.Motors.M1, -lw);
    PCAmotor.MotorRun(PCAmotor.Motors.M4, rw);
}

basic.forever(() => {
   if (radioMessage2 === 128) {
       autickoJede(0, 0);

    } else  if (radioMessage2 >= 129 && radioMessage1 >= 129) {
        const speed = (radioMessage2 - 128) * 2;
        let equality = speed / 6;
        let slow = (radioMessage1 - 128) * 2;



       let finalSpeed = speed - slow
       autickoJede(speed, finalSpeed)

    }   else if (radioMessage2 >= 129 && radioMessage1 <= 127) {
        const speed = (radioMessage2 - 128) * 2;
        let equality = speed / 6; // regulace cuz pravej motor je silnejsi
        let slow = (128 - radioMessage1) * 2;



       autickoJede(speed - slow, speed - equality)

   } else if (radioMessage2 <= 127 && radioMessage1 >= 129) {
        const speedR = (128 - radioMessage2) * -2;
        let equality = speedR / 6;
        let slowR = (radioMessage1 - 128) * 2;


        let finalSpeed = speedR - slowR
       autickoJede(speedR, finalSpeed)

   } else if (radioMessage2 <= 127 && radioMessage1 <= 127) {
       const speedR = (128 - radioMessage2) * -2;
       let equality = speedR / 6;
       let slowR = (128 - radioMessage1) * 2;



       autickoJede(speedR - slowR, speedR)
   }



}); // rovně doleva, dozadu doleva, rovně doprava, dozadu doprava
/* else if (radioMessage1 > 150) {
        doprava()
    } else if (radioMessage1 < 100) {
        doleva()
   } else if (radioMessage1 === 128 || radioMessage2 === 128) {
        stat() */