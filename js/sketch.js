var scene;
var aspect;
var camera;
var renderer;
var stats;
var controls;
var gridHelper;
var body = document.getElementsByTagName('body')[0];

var sphere;

var CONTROLS__ORBIT = 'CONTROLS__ORBIT';

var CAMERA_PERSPECTIVE = 'CAMERA_PERSPECTIVE';

function setup(params) {
  var options = {
    ambientLight: true,
    camera: CAMERA_PERSPECTIVE,
    directionLight: true,
    controls: CONTROLS__ORBIT,
    gridHelper: true,
    stats: true,
    orbitControls: {
      enablePan: true,
      enableZoom: true,
      enableRotate: true
    }
  };

  if(params instanceof Object) {
    //use params to overwrite defaults:
    for (var prop in params) {
        if (!params.hasOwnProperty(prop)) {
          continue;
        }
        options[prop] = params[prop];
    }
  }

  scene = new THREE.Scene();
  aspect = window.innerWidth / window.innerHeight;

  if(options.camera === CAMERA_PERSPECTIVE) {
    //PerspectiveCamera(fov, aspect, near, far)
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.z = -5;
    camera.position.y = 2;
  } else {
    console.warn('Camera parameter not supported yet in boilerplate');
  }

  if(!options.controls) {
    //no camera controls
  } else if(options.controls === CONTROLS__ORBIT) {
    controls = new THREE.OrbitControls(camera);
    if(!options.orbitControls.enablePan) {
      controls.enablePan = false;
    }
    if(!options.orbitControls.enableZoom) {
      controls.enableZoom = false;
    }
    if(!options.orbitControls.enableRotate) {
      controls.enableRotate = false;
    }
  } else {
    console.warn('Camera controls parameter not supported yet in boilerplate');
  }

  if(options.gridHelper) {
    gridHelper = new THREE.GridHelper(200, 40, 0x0000dd, 0x808080);
    scene.add(gridHelper);
  }

  if(options.ambientLight) {
    var light = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(light);
  }

  if(options.directionLight) {
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.position.set( 1, 1, -1.1 ).normalize();
    scene.add( directionalLight );
  }

  if(options.stats) {
    insertStatsGUI();
  }

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

}

function fillScene() {
  //create ground
  var groundPlaneGeometry = new THREE.PlaneGeometry(60,40,1,1);
  var groundPlaneMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
  var groundPlane = new THREE.Mesh(groundPlaneGeometry,groundPlaneMaterial);

  addSphere();
}

function addSphere() {
  var geometry = new THREE.SphereGeometry(2, 128, 128);
  var material = new THREE.MeshPhongMaterial({
    color: 0xff00ff,
    specular: 0xeeeeee,
    shininess: 25
  });
  sphere = new THREE.Mesh(geometry, material);
  sphere.translateY(0.5);
  scene.add(sphere);
}

function render() {
  requestAnimationFrame(render);

  if(stats && stats.update)         stats.update();
  if(controls && controls.update)   controls.update();

  renderer.render(scene, camera);
}

function insertStatsGUI() {
  stats = new Stats();
  stats.domElement.style.bottom = '0px';
  stats.domElement.style.right = '0px'
  stats.domElement.style.left = ''
  stats.domElement.style.top = '';
  body.appendChild(stats.dom);
}

setup();
fillScene();
render();
insertStatsGUI();
