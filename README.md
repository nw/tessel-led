
## Tessel Led

Help for controlling LEDs on the tessel board.

### Install

```bash
  npm install tessel-led --save
```

### Usage

```js

  var led = require('tessel-led');
  
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
  
```

### Features

* Automatically resets all LEDs when exiting, like CTRL-C.
* Easier access to LEDs. via index, name, color, position
* Simple interface for blinking or flashing LEDs
* Flow control DSL to help with writing complex LED animations
* TODO: support for [neopixel](https://learn.adafruit.com/adafruit-neopixel-uberguide)

### LEDs 

All LEDs on the tessel board are wrapped into a LED instance

You can access any of LEDs multiple ways. 

##### LED (index: 0, name: led1, color: green, position: 3)

```js
  led[0]
  led.led1
  led.green
  led.pos(3)
```

##### LED (index: 1, name: led2, color: blue, position: 4)

```js
  led[1]
  led.led2
  led.blue
  led.pos(4)
```

##### LED (index: 2, name: error, color: red, position: 1)

```js
  led[2]
  led.error
  led.red
  led.pos(1)
```

##### LED (index: 3, name: conn, color: amber, position: 2)

```js
  led[3]
  led.conn
  led.amber
  led.pos(2)
```


#### show()

turns the LED on.

```js
  led.blue.show();
```

#### hide()

turns the LED off.

```js
  led.led2.hide();
```

#### blink(duration, cb)

turns the LED on for specified duration. default = 100. Once complete fires optional callback.

```js
  led.green.blink(500, function(){
    console.log('green LED was on for 500ms but is now off.')
  });
```

#### flash(times, duration, delay, cb)

flashes the LED on & off `times` times. duration is the length the LED is on, default = 100. delay is the length the LED is off, default = 100. Once complete with all `times` fires optional callback.

```js
  led.error.flash(5, 200, 100, function(){
    console.log('red LED flashed 5 times');
  });
```

### LED.Group

Flow control class to help with chaining complex LED animations.
