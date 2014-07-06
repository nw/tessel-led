var led = require('../index');

led.blue.blink(2000); // select by color
led.led1.blink(1500); // select by name
led[3].blink(1000); // select by index
led.pos(1).blink(500); // select by position