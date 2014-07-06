var tessel = require('tessel');

function LED(idx, options){
  
  this.idx = idx;
  this.state = false;
  
  this.name = options.name;
  this.color = options.color;
  this.pos = options.pos;
  
  this.led = tessel.led[this.idx];
  
}

LED.prototype = {
  
  show: function(){
    this.state = true;
    this._write();
  },
  
  hide: function(){
    this.state = false;
    this._write();
  },
  
  _write: function(){
    this.led.write(this.state)
  },
  
  blink: function(duration, cb){
    var self = this;
    
    if(typeof duration === 'function'){
      cb = duration;
      duration = null;
    }
    if(!duration) duration = 100;
    
    this.show();
    
    setTimeout(function(){
      self.hide();
      return (typeof cb === 'function') ? cb() : null;
    }, duration);
    
  },
  
  flash: function(times, duration, delay, cb){
    var self = this;
    
    if(typeof duration === 'function'){
      cb = duration;
      duration = delay = 100;
    } else if(typeof delay === 'function'){
      cb = delay;
      delay = duration;
    }
    
    this.show();
    
    setTimeout(function(){
      self.hide();
      if(times--){
        setTimeout(function(){
          self.flash(times, duration, delay, cb);
        }, delay);
      } else {
        if(typeof cb === 'function') cb();
      }
    }, duration);
  }
  
}

module.exports = LED;