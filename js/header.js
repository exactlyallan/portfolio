// Header Three.js allanenemark.com
// Based on: https://github.com/mrdoob/three.js/blob/dev/examples/webgl_geometry_terrain.html
// Huge props to Mr.Doob! 


// standard global variables
var container, scene, camera, renderer, controls, stats;

// Dom container
var containerName = $('#top-viz');

// set height
var SCREEN_WIDTH = containerName.width();
var SCREEN_HEIGHT = SCREEN_WIDTH / 2;
containerName.height(SCREEN_HEIGHT); // set container based on content

// custom global variables
var terrainGeo = null;
var terrainMesh = null;
var heightData = null;
var vertices = null;

var worldWidth = 128,
    worldDepth = 128;
var worldHalfWidth = worldWidth / 2,
    worldHalfDepth = worldDepth / 2;

var heightMultiplier = 2;
var counter = 0;

// initial zoom action
var zoomTo;
var zoomRun = true;


function initTop() {
    ///////////
    // SCENE //
    ///////////
    scene = new THREE.Scene();



    ////////////
    // CAMERA //
    ////////////

    // camera attributes
    var VIEW_ANGLE = 45,
        ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
        NEAR = 0.1,
        FAR = 50000;

    // set up camera
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

    // rotate 'up' axis to match terrain
    camera.up.set(0, 0, 1);

    // add the camera to the scene
    scene.add(camera);


    //////////////
    // RENDERER //
    //////////////

    // create and start the renderer; choose antialias setting.
    if (Detector.webgl) {
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
    } else {
        renderer = new THREE.CanvasRenderer();
    }

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    // attach div element to variable to contain the renderer
    container = containerName;

    // attach renderer to the container div
    container.html(renderer.domElement);


    //////////////
    // CONTROLS //
    //////////////

    // keep as backup
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.autoRotate = false; // rotate it manually
    controls.minDistance = 200;
    controls.maxDistance = 1500;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.enableKeys = true;


    ///////////
    // LIGHT //
    ///////////

    // create a light
    var light = new THREE.AmbientLight(0xC3C3C3); // soft white light
    scene.add(light);

    ////////////
    // SKYBOX //
    ///////////

    var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
    var skyBoxMaterial = new THREE.MeshBasicMaterial({
        color: 0xeceaea, //efefef
        side: THREE.BackSide
    });
    var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
    scene.add(skyBox);


    // Create Terrain
    buildTerrain();

    // Begin animation! 
    animate();


}; // end init

initTop(); // START! //



// Resize to container listener
function onWindowResize() {

    SCREEN_WIDTH = containerName.width();
    SCREEN_HEIGHT = SCREEN_WIDTH / 2;
    containerName.height(SCREEN_HEIGHT); // set container based on content

    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

}
$(window).resize(onWindowResize);



// Initial terrain build
function buildTerrain() {

    heightData = generateHeight(worldWidth, worldDepth);

    terrainGeo = new THREE.PlaneBufferGeometry(worldWidth * 5, worldDepth * 5, worldWidth - 1, worldDepth - 1);
    //terrainGeo.rotateX(-Math.PI / 2); // specify which vertice set is 'up'

    vertices = terrainGeo.attributes.position.array;

    // Note: BufferGeo, hence the +=3
    for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {

        vertices[j + 2] = heightData[i] * heightMultiplier; // vertices[j + 1] for terrainGeo.rotateX
    }

    var color = new THREE.Color();
    color.setStyle('#' + setBaseColor()) // set color from behavior.js colorSet

    var material = new THREE.MeshPhongMaterial({
        wireframe: true,
        color: color
    });
    material

    terrainMesh = new THREE.Mesh(terrainGeo, material);
    scene.add(terrainMesh)

    // update initial cam position to show full terrain
    camera.position.y = heightData[worldHalfWidth + worldHalfDepth * worldWidth] + 780;
    camera.position.z = 550;
    camera.position.x = 1;

    // final camera position delta from original ( manually positioned )
    zoomTo = {
        "x1": camera.position.x,
        "x2": 0.7,
        "y1": camera.position.y,
        "y2": 575,
        "z1": camera.position.z,
        "z2": 377
    };

};

// Create dynamic terrain
function updateTerrain() {

    // Increment Counter
    counter = counter + 0.0025;

    var osilate = Math.cos(counter);

    // check if near zero to update heightmap data
    if (isEpsilon(osilate)) {
        heightData = generateHeight(worldWidth, worldDepth);
    }

    // update verts
    for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {

        vertices[j + 2] = heightData[i] * osilate * heightMultiplier;
    }

    terrainMesh.geometry.attributes.position.needsUpdate = true;
    //terrainMesh.geometry.verticesNeedUpdate = true; // unnecessary since using bufferGeometry

};

// Check if near zero
function isEpsilon(number) {
    return Math.abs(number) < 1e-25;
}

// Perlin noise magic
function generateHeight(width, height) {

    var size = width * height,
        data = new Uint8Array(size),
        perlin = new ImprovedNoise(),
        quality = 1,
        z = Math.random() * 100;

    for (var j = 0; j < 4; j++) {

        for (var i = 0; i < size; i++) {

            var x = i % width,
                y = ~~(i / width);
            data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);

        }

        quality *= 5; // wavy-ness 

    }

    return data;

};

// Zoom Hack
function zoomIn(counter) {

    var percent = Math.sin((Math.PI / 2) * counter);

    if (percent >= 0.99) {
        zoomRun = false;

    } else {
        camera.position.x = zoomTo.x1 - (zoomTo.x2 * percent);
        camera.position.y = zoomTo.y1 - (zoomTo.y2 * percent);
        camera.position.z = zoomTo.z1 - (zoomTo.z2 * percent);
    }
}

// Rotation Hack
function rotateZ() {
    terrainMesh.rotateZ(Math.PI / 4000);
}


// Note order of operations for dynamic geometry
function animate() {
    requestAnimationFrame(animate);
    render();

};

function render() {

    if (zoomRun) {
        zoomIn(counter);
    }
    rotateZ();
    controls.update();
    updateTerrain();
    renderer.render(scene, camera);
};


