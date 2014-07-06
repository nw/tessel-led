var led = require('../index')
  , group = new led.Group([led.red, led.amber, led.green, led.blue]);
  
group
  .parallel()
    .red().flash(10, 250, 150)
    .blue().flash(10, 200, 200)
    .green().delay(400).flash(6, 300, 200)
    .amber().delay(650).flash(8, 100, 150)
  .delay(500)
  .serial()
    .conn().blink(1000)
    .led1().blink(450)
    .led2().blink(350)
    .error().delay(300).blink(400)
  .start(function loop(){
    console.log("DONE!")
    //group.start(loop);
  });
