var tessel = require('tessel')
  , LED = require('./lib/led')
  , Group = require('./lib/group');


exports.leds = [ 
  { name: 'led1', color: 'green', pos: 3}
, { name: 'led2', color: 'blue', pos: 4}
, { name: 'error', color: 'red', pos: 1}
, { name: 'conn', color: 'amber', pos: 2} 
].map(function(spec, idx){
  return exports[idx] = 
    exports[spec.name] = 
    exports[spec.color] = new LED(idx, spec);
});


exports.pos = exports.position = function(pos){
  return exports.leds.filter(function(led){
    return (pos === led.pos)
  })[0]
};

exports.Group = Group;


process.on('exit', function(){
  exports.leds.forEach(function(led){
    led.hide();
  });
});