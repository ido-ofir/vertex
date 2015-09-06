function equals(a, b) {
    return (a[0] === b[0] && a[1] === b[1] && a[2] === b[2])
}

function vertexInArray(vertex, array) {
    for(var i = 0; i < array.length; i++){
        if(equals(array[i], vertex)){
            return true;
        }
    }
    return false;
}

window.stringifyArray = function stringifyArray(arr) {
    var z, v = [], w = [];
    for(var i = 0; i < arr.length; i++){
        if(Array.isArray(arr[i])){
            w = [];
            for(var k = 0; k < arr[i].length; k++){
                w.push(arr[i][k]);
            }
            v.push('[' + w.join(',') + ']');
        }
        else{
            v.push(arr[i])
        }
    }
    return '[' + v.join(',') + ']';
};

function copyDeepArray(arr) {
    return arr.map((a) => {
        return a.map((b) => { return b; });
    });
}

function getClosestIndex(index, exclude) {
    var myIndex = false,
        myDistance = 99999;
    var distance, p;
    var vertex = data.vertices[index];
    var point = new THREE.Vector3( vertex[0], vertex[1], vertex[2] );
    for(var i = 0; i < data.vertices.length; i++){
        if(i === index) {
            continue;
        }
        if( i > half) continue;
        if(exclude && exclude.indexOf(i) > -1) continue;
        p = data.vertices[i];
        distance = point.distanceTo(new THREE.Vector3( p[0], p[1], p[2] ));
        if(distance < myDistance){
            myDistance = distance;
            myIndex = i;
        }
    }
    return myIndex;
}




module.exports = {
    equals: equals,
    vertexInArray: vertexInArray,
    stringifyArray: stringifyArray,
    getClosestIndex: getClosestIndex
};



//for(var i = 0; i < geometry.vertices.length; i++){
//    var dot = makeDot(geometry.vertices[i]);
//    v.push('[' + geometry.vertices[i].x + ',' + geometry.vertices[i].y + ',' + geometry.vertices[i].z + ']');
//    three.scene.add(dot);
//}
//var t = document.getElementsByTagName('textarea');
//console.dir(t);
//t[0].value = '[' + v.join(',') + ']';