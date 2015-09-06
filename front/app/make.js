var elements = require('./elements.js');


function renderDot(vertex, timeout){
    setTimeout(()=>{
        makeDot(vertex);
    }, timeout);
}

var gridDotMaterial = new THREE.MeshBasicMaterial({
    color : '#4b4'
});
var gridDotGeometry = new THREE.SphereGeometry( 0.1 );
function makeGridDot(v, vIndex) {
    var gridDot = new THREE.Mesh( gridDotGeometry, gridDotMaterial );
    gridDot.vertex = v;
    gridDot.vIndex = vIndex;
    gridDot.position.set( v[0], v[1], v[2] );
    return gridDot;
}


function makeDot(v, color, radius) {
    var dotMaterial = new THREE.MeshBasicMaterial({
        color : color || '#fff'
    });
    var dotGeometry = new THREE.SphereGeometry( radius || 0.12 );
    var dot = new THREE.Mesh( dotGeometry, dotMaterial );
    dot.position.set( v[0], v[1], v[2] );
    return dot;
}

function makeLine(start, end) {
    var lineMaterial = new THREE.LineBasicMaterial({
        color : '#fef',
        linewidth: 0.3
    });
    var geometry = new THREE.Geometry();

    geometry.vertices.push(
        new THREE.Vector3( start[0], start[1], start[2] ),
        new THREE.Vector3( end[0], end[1], end[2] )
    );
    var line = new THREE.Line( geometry, lineMaterial);
    return line;
}

function makeFace(a, b, c) {
    var geom = new THREE.Geometry();
    var v1 = new THREE.Vector3(a[0], a[1], a[2]);
    var v2 = new THREE.Vector3(b[0], b[1], b[2]);
    var v3 = new THREE.Vector3(c[0], c[1], c[2]);

    geom.vertices.push(v1);
    geom.vertices.push(v2);
    geom.vertices.push(v3);

    geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
    var face= new THREE.Mesh( geom, new THREE.MeshBasicMaterial({
        color: 0xfff8ff,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide,
        depthTest: false
    }) );
    return face;
}




function setPosition(position, v) {
    position.x = v[0];
    position.y = v[1];
    position.z = v[2];
}

function markers(v) {
    var a = makeDot(v, '#f00');
    var b = makeDot([-v[0], v[1], v[2]], '#f00');
    stage.space.add(a);
    stage.space.add(b);
    return {
        set(v){
            setPosition(a.position, v);
            setPosition(b.position, [-v[0], v[1], v[2]]);
        },
        dots: [a, b]
    };
}

module.exports = {
    dot: makeDot,
    face: makeFace,
    line: makeLine,
    gridDot: makeGridDot,
    markers: markers
};