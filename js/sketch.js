var song;
var fft;

var waitress;

var songFilepath = "auntie-flo-ft-anbuley-dance-ritual-ii.mp3";

var particles = [];

var cardsImg;

var id = 52;	//keep track of which card face to draw

var timeAllotted = 0;

var LOW=1, MED=2, HIGH=3;

var FRAME_RATE__IDEAL = 60; //60 fps

// c is for card:
var CARD_WIDTH = 71,
  CARD_WIDTH_HALF= CARD_WIDTH / 2;
var CARD_HEIGHT= 96,
  CARD_HEIGHT_HALF= CARD_HEIGHT/ 2;

function preload() {
  song = loadSound(songFilepath);
  cardsImg = loadImage("cards.png");
	// background(0, 128, 0);
}

function setup() {
  // frameRate(15);

  createCanvas(windowWidth,windowHeight);
  background(0, 128, 0);

  song.loop(); // song is ready to play during setup() because it was loaded during preload

  fft = new p5.FFT();
  fft.setInput(song);
}

var THUD_SPECTRUM_INDEX = 1024/4;

function draw() {
  var timeAllottedNew = millis();
  var timeDelta = timeAllottedNew - timeAllotted;
  timeAllotted = timeAllottedNew;

  background('rgba(0, 128, 0, .05)');

  var spectrum = fft.analyze();
  var thud_level = spectrum[THUD_SPECTRUM_INDEX];
  if(thud_level > 123) {
    handleThud(HIGH);
  }
  else if(thud_level > 105) {
    handleThud(MED);
  }
  // else if(thud_level > 60) {
  // 	handleThud(LOW);
  // }

  updateCards(timeDelta);

  waitress = millis() + 10000; //something to do with optimizing resizing window code

  if(window.monitorStats && window.monitorStats.update) {
    window.monitorStats.update();
  }
}


//////

var Particle = function (id, x, y, sx, sy) {
  var cx = ( id % 4 ) * CARD_WIDTH;
  var cy = Math.floor( id / 4 ) * CARD_HEIGHT;
  if (sx === 0) {
    sx = 2;
  }

  this.update = function (delta) {
    x += sx * (delta/1000 * FRAME_RATE__IDEAL);
    y += sy * (delta/1000 * FRAME_RATE__IDEAL);

    if ( x < - CARD_WIDTH || x > width ) {
      //remove card from particles + no longer update it:
      var index = particles.indexOf( this );
      particles.splice( index, 1 );

      return false;	//denotes card has been removed
    }

    if ( y > height - CARD_HEIGHT) {
      y = height - CARD_HEIGHT;
      sy = - sy * 0.85;
    }

    sy += 0.98;

    image(cardsImg, cx, cy, CARD_WIDTH, CARD_HEIGHT, x, y, CARD_WIDTH, CARD_HEIGHT);

    return true;	//dentes card is still in particles array
  };
}; //end of Particle constructor

var throwCard = function (x, y) {
  id > 0 ? id -- : id = 51;

  particles.push(new Particle(
    id,
    x,
    y,
    Math.floor( Math.random() * 6 - 3 ) * 2,
    - Math.random() * 16
  ));
};

function handleThud(level) {
  var w = width;
  var h = height;
  var iMax = level;
  var maxH;

  if(level === HIGH) {
    maxH = h;
  } else if(level === MED) {
    maxH = h*2/3
  } else {
    maxH = h/3
  }

  for(var i=0; i<iMax; ++i) {
    var x = Math.floor( Math.random() * w );
    var y = Math.floor( Math.random() * maxH );
    for(var j=0; j<2; ++j) {
      throwCard(x, y);
    }
  }
}

function windowResized() {
  waitress = millis() + 2000;
  if (fullscreen()) {
    resizeCanvas(displayWidth, displayHeight);
    // background(0, 128, 0);
  } else {
    resizeCanvas(windowWidth,windowHeight);
    // background(0, 128, 0);
  }
  cursor();
  showing = true;
  // background(0);
}

function updateCards(delta) {
  // var deltaInSeconds = clock.getDelta();
  var i = 0,
    l = particles.length;
  while ( i < l ) {
    particles[i].update(delta) ? i ++ : l --;
  }
}

function insertStatsGUI() {
  var stats = new Stats();
  stats.domElement.style.bottom = '0px';
  stats.domElement.style.right = '0px'
  stats.domElement.style.left = ''
  stats.domElement.style.top = '';
  document.getElementsByTagName('body')[0].appendChild(stats.dom);

  window.monitorStats = stats;
}
