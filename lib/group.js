function Group(leds){
  var self = this;
  
  this.leds = [].concat(leds);
  
  this._cmds = [];

  this.reset();
  
  this.leds.forEach(function(led, idx){
    self[led.name] = self[led.color] = function(){
      self._selection.push(led);
      return self;
    }
  });
}

Group.prototype = {
  
  all: function(){
    this._selection = this.leds.concat([]); 
    return this;
  },
  
  led: function(led){
    var self = this;
    if(typeof led === 'string'){
      led.split(' ').forEach(function(l){
        if(self[l]) self[l]();
      })
    } else {
      for(var i=0; i < arguments.length; i++){
        this._selection.push(arguments[i]);
      }
    }
    return this;
  },
  
  index: function(idx){
    var led = this.leds.filter(function(led){
          return (led.idx === idx);
    })[0];
    
    if(led) this._selection.push(led);
    
    return this;
  },
  
  position: function(pos){
    var led = this.leds.filter(function(led){
      return (led.pos === pos);
    })[0];
    
    if(led) this._selection.push(led);
    
    return this;
  },
  
  call: function(fn){
    fn(this);
    return this;
  },
  
  reset: function(){
    this._selection = [];
    this.halt = false;
    this._wait = true;
    this._running = 0;
    return this;
  },
  
  start: function(cb){ // maybe run
    this._finished = cb || function(){};
    this._queue = [].concat(this._cmds);
    this._check();
    return this;
  },
  
  stop: function(){
    this.halt = true;
    this.leds.forEach(function(led){
      led.hide();
    });
    return this;
  },
  
  
  _check: function(){
    var self = this;
    
    if(this.halt || (this._wait && this._running) || this._waiting) return;

    while(!this._waiting && (!this._wait || !this._running)){
        var cmd = this._queue.shift();
      
        if(!cmd && !this._running && !this._queue.length){
          this.reset();
          this._finished();
        }
      
        if(!cmd) return true;
      
        if(cmd.name === 'wait' && this._running){
          this._queue.unshift(cmd);
          return true;
        }
      
        this._running++;
        var run = (cmd.name === 'wait') ? wait(cmd) : wrap(cmd);
        
        if(cmd.delay){
          if(typeof cmd.delay === 'function'){
            cmd.delay(run);
          } else {
            setTimeout(run, cmd.delay);
          }
        } else run();
    }
    
    function wait(cmd, w){
      self._waiting = true;
      return function(){
        self._wait = cmd.value;
        self._waiting = false;
        done();
      }
    }
    
    function wrap(cmd){
      return function (){
        self._run(cmd, done);
      }
    }
    
    function done(){
      self._running--;
      if(!self._wait || !self._running) self._check();
    }
    
  },
  
  _run: function(cmd, cb){
    var self = this
      , fn = self[cmd.name];
      
    if(typeof fn !== 'function') return cb();

    fn.apply(self, [cmd.selection, cb].concat(cmd.args));
  },
  
  _blink: function(selection, cb, duration){
    var count = selection.length;
    selection.forEach(function(led){
      led.blink(duration || 100, finish);
    })
    
    if(!count) cb();
    
    function finish(){
      count--;
      if(count <= 0) cb();
    }
    
  },
  
  _flash: function(selection, cb, times, duration, delay){
    var count = selection.length;
    
    selection.forEach(function(led){
      led.flash(times, duration, delay, finish);
    })
    
    if(!count) cb;
    
    function finish(){
      count--;
      if(count <= 0) cb();
    }
    
  },
  
  forEach: function(cb){
    this.parallel();
    for(var i = 0; i < this.leds.length; i++){
      this[this.leds[i].name]();
      cb(this, i);
    }
    this.serial();
    return this;
  }

}

;['serial', 'parallel'].forEach(function(method){
  Group.prototype[method] = function(){
    this._cmds.push({
      name: 'wait'
    , value: (method === 'serial')
    , delay: this._delay
    });
    this._delay = null;
    return this;
  }
})

;[ 'blink', 'flash' ].forEach(function(method){
  Group.prototype[method] = function(){    
    this._cmds.push({
      name: '_'+method
    , selection: this._selection.concat([])
    , args: [].slice.call(arguments, 0)
    , delay: this._delay
    });
    this._delay = null;
    this._selection = [];
    return this;
  }
});

Group.prototype.delay = function(ms){
   this._delay = ms;
   return this;
}

module.exports = Group;