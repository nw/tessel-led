  var led = require('../index');
  
  led.blue.blink(500);
  led.error.flash(5, 250);
  
  var group = new led.Group([led.blue, led.green, led.amber, led.red]);
  
  group
  .serial()
    .led('conn green').flash(10, 100, 50)
    .red().blink(500)
    .index(1).blink()
  .forEach(function(led, idx){
    led.delay(100 * idx).flash(5 + (idx * 2), 300, 150)
  })
  .parallel(200)
    .blue().blink(500)
    .conn().delay(250).blink(500)
  .start();