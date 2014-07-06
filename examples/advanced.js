var led = require('../index')
  , ordered = [led.red, led.amber, led.green, led.blue]
  , group = new led.Group(ordered)
  , group2 = new led.Group(ordered.reverse());
  
group
  .delay(function(cb){ // delay can take a fn that takes a callback
    setTimeout(cb, 300)
  })
  .serial()
    .blue().amber().blink(500) // select multiple by color
    .position(3).blink(250) // select by position
    .red().flash(3, 100, 50)
  .forEach(function(led, idx){ // returns in order of led list passed in on initialization
    // treats all leds in loop as parallel
    led.delay(idx*25).flash(3 + (idx * 2), 100, 50 + (idx * 25))
  }) // reverts to serial automatically afterwards
  .parallel() // hence the need to explicitly set this
    .index(0).flash(8, 250, 100) // select by index
    .error().delay(100).flash(5, 150, 75) // select by name
    .led2().blink(800)
  // note: parallel after parallel. Logical grouping of commands.
  .parallel()
    .amber().error().blink(500)
    .led(led.green, led.red).delay(1000).flash(7, 300, 200) // select by list of LED objects
    .led('led2 conn').delay(1300).flash(7, 300, 200) // pass a string of led names or colors
  .call(serial_blink(350)); // plugin support

  
group2
  .delay(100)
  .parallel()
    .all().flash(5, 250, 150)
  .forEach(function(led, idx){ 
    // same function as forEach above but will produce different results
    // order of LEDs on initialize are different
    led.delay(idx*20).flash(3 + (idx * 2), 100, 50 + (idx * 50))
  })
  .delay(200)
  .parallel()
    .led('red blue').flash(5, 200, 300)
    .led('amber green').flash(5, 300, 200);

// start our color animation
// alternate the loop between group 1 and 2
group.start(function part1(){
  group2.start(function(){
    group.start(part1);
  });
});
  
function serial_blink(duration){
  return function(group){
     return group.serial()
        .led1().blink(duration)
        .led2().blink(duration)
        .conn().blink(duration)
        .error().blink(duration);
  }
}