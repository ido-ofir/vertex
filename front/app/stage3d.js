
var zoomGlide = 4;
var rotationXGlide = 4;
var rotationYGlide = 4;
var clickListeners = [];  // { targets: [], listener: f}
var target = {
    scale: 1,
    rotation: {
        x: 0,
        y: 0,
        z: 0
    }
};

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(0, 0);

function stage3d (container) {
    var mouseIsDown = false;
    var lastX = 0, lastY;
    container.addEventListener('mousewheel', function(e){
        if(e.deltaY > 0){
            target.scale -= 0.1;
        }
        else if(e.deltaY < 0){
            target.scale += 0.1;
        }
    });
    container.addEventListener('mousedown', function(e){
        mouseIsDown = true;
        lastX = e.pageX;
        lastY = e.pageY;
    });
    container.addEventListener('mousemove', function(e){
        var factor = 0.04;
        mouse.x = ( e.layerX / container.clientWidth ) * 2 - 1;
        mouse.y = - ( e.layerY / container.clientHeight ) * 2 + 1;
        if(mouseIsDown){
            if(lastX > e.pageX){
                target.rotation.y -= factor;
            }
            else if(lastX < e.pageX){
                target.rotation.y += factor;
            }
            if(lastY > e.pageY){
                target.rotation.x -= factor;
            }
            else if(lastY < e.pageY){
                target.rotation.x += factor;
            }
            if(target.rotation.x < -2) target.rotation.x = -2;
            if(target.rotation.x > 2) target.rotation.x = 2;
            lastX = e.pageX;
            lastY = e.pageY;
        }
    });
    container.addEventListener('click', function(e){
        var intersects, bubble;
        for(var i = 0; i < clickListeners.length; i++){
            intersects = raycaster.intersectObjects( clickListeners[i].targets );
            if(intersects[0]){
                bubble = clickListeners[i].listener(intersects[0]);
                if(bubble === false) return;
            }
        }
    });

    function onClick(targets, listener) {
        clickListeners.push({ targets: targets, listener: listener})
    }

    document.body.addEventListener('mouseup', function(e){
        mouseIsDown = false;
        e.stopPropagation();
        e.preventDefault();
    });
    var renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha : true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    var scene = new THREE.Scene();
    var camera = window.camera = new THREE.PerspectiveCamera(45,
        container.clientWidth / container.clientHeight, 1, 4000);
    camera.position.set(0, 0, 50);
    var space = new THREE.Object3D();
    scene.add(space);

    function loop () {
        renderer.render(scene, camera);
        raycaster.setFromCamera( mouse, camera );
        if(Math.abs(target.scale - space.scale.z) > 0.01){
            var scale = space.scale.z + ((target.scale - space.scale.z) / zoomGlide);
            space.scale.z = space.scale.x = space.scale.y = scale;
        }
        if(Math.abs(target.rotation.x - space.rotation.x) > 0.01){
            var rotationX = space.rotation.x + ((target.rotation.x - space.rotation.x) / rotationXGlide);
            space.rotation.x = rotationX;
        }
        if(Math.abs(target.rotation.y - space.rotation.y) > 0.01){
            var rotationY = space.rotation.y + ((target.rotation.y - space.rotation.y) / rotationYGlide);
            space.rotation.y = rotationY;
        }
        requestAnimationFrame(loop);
    }

    loop();
    return {
        container: container,
        renderer: renderer,
        scene: scene,
        camera: camera,
        space: space,
        onClick: onClick
    };
}



module.exports = stage3d;