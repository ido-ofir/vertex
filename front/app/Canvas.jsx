var make = require('./make.js');
var utils = require('./utils.js');
var elements = window.elements = require('./elements.js');
var make = window.make = require('./make.js');
var utils = window.utils = require('./utils.js');
var Stage3d = require('./Stage3d');

var stage, half = 0;



function addGridDot(v) {
    var a = make.gridDot(v, elements.gridDots.length);
    elements.gridDots.push(a);
    return stage.space.add(a);
}

function setArrayPositionByVIndex(array, vIndex, vertex) {
    var el, i;
    for(i = 0; i < array.length; i++){
        el = array[i];
        if(el.vIndex === vIndex){
            el.position.x = vertex[0];
            el.position.y = vertex[1];
            el.position.z = vertex[2];
            return;
        }
    }
}
function setPosition(position, vertex) {
    position.x = vertex[0];
    position.y = vertex[1];
    position.z = vertex[2];
}


module.exports = React.createClass({
    getInitialState(){
        return {
            wireframe: this.props.data.wireframe,
            grid: this.props.data.grid
        };
    },
    addDot(vIndex, options) {
        options = options || {};
        var vertex = this.props.data.source[vIndex];
        var dot = make.dot(vertex, options.color, options.radius);
        var vIndex = options.vIndex;
        dot.vertex = vertex;
        dot.vIndex = vIndex;
        elements.dots.push(dot);
        return stage.space.add(dot);
    },
    addLine(vIndexA, vIndexB) {
        var source = this.props.data.source;
        var a = source[vIndexA];
        var b = source[vIndexB];
        var line = make.line(a, b);
        line.vIndexA = vIndexA;
        line.vIndexB = vIndexB;
        elements.lines.push(line);
        return stage.space.add(line);
    },
    addFace (face) {
        var source = this.props.data.source;
        var a = source[face[0]];
        var b = source[face[1]];
        var c = source[face[2]];
        var faceElement = make.face(a, b, c);
        faceElement.vIndexA = face[0];
        faceElement.vIndexB = face[1];
        faceElement.vIndexC = face[2];
        elements.faces.push(faceElement);
        return stage.space.add(faceElement);
    },
    removeDot(vIndex){
        for(var i = 0; i < elements.dots.length; i++){
            if(elements.dots[i].vIndex === vIndex){
                stage.space.remove(elements.dots[i]);
                elements.dots.splice(i, 1);
                return;
            }
        }
    },
    removeLine(vIndexA, vIndexB){
        var a, b;
        for(var i = 0; i < elements.lines.length; i++){
            a = elements.lines[i].vIndexA;
            b = elements.lines[i].vIndexB;
            if((a === vIndexA && b === vIndexB) || (b === vIndexA && a === vIndexB)){
                stage.space.remove(elements.lines[i]);
                elements.lines.splice(i, 1);
                return;
            }
        }
    },
    removeFace (face) {
        var el;
        for(var i = 0; i < elements.faces.length; i++){
            el = elements.faces[i];
            console.log(face, el.vIndexA, el.vIndexB, el.vIndexC);
            if(face.indexOf(el.vIndexA) > -1 && face.indexOf(el.vIndexB) > -1 && face.indexOf(el.vIndexC) > -1){
                stage.space.remove(el);
                elements.faces.splice(i, 1);
            }
        }
    },
    addMarker(vIndex){
        var source = this.props.data.source;
        var vertex = source[vIndex];
        var marker = make.dot(vertex, '#f00', 0.14);
        marker.vIndex = vIndex;
        elements.markers.push(marker);
        console.dir(marker);
        return stage.space.add(marker);
    },
    removeMarker(vIndex){
        for(var i = 0; i < elements.markers.length; i++){
            if(elements.markers[i].vIndex === vIndex){
                stage.space.remove(elements.markers[i]);
                elements.markers.splice(i, 1);
                return;
            }
        }
    },

    onClick(targets, listener){
        stage.onClick(targets, listener);
    },
    hasDot(vIndex){
        for(var i = 0; i < elements.dots.length; i++){
            if(elements.dots[i].vIndex === vIndex) return true;
        }
    },
    hasLine(vIndexA, vIndexB){
        var line;
        for(var i = 1; i < elements.lines.length; i++){
            line = elements.lines[i];
            if((line.vIndexA === vIndexA && line.vIndexB === vIndexB) || (line.vIndexB === vIndexA && line.vIndexA === vIndexB)) return true;
        }
        return false;
    },
    hasFace(face){
        var faceElement;
        for(var i = 1; i < elements.faces.length; i++){
            faceElement = elements.faces[i];
            if(face.indexOf(faceElement.vIndexA) > -1 && face.indexOf(faceElement.vIndexB) > -1 && face.indexOf(faceElement.vIndexC) > -1) {
                return true;
            }
        }
        return false;
    },
    loadWireFrame(options){
        var loader = new THREE.JSONLoader();
        loader.load(options.path, (geometry) => {
            geometry.mergeVertices();
            geometry.center();
            var material = new THREE.MeshBasicMaterial({
                color : options.color || '#FFF',
                transparent: true,
                opacity: options.opacity ||0.5,
                wireframe: true
            });
            var wireframe = new THREE.Mesh(geometry, material);
            if(this.state.wireframe){
                stage.space.add(wireframe);
                this.setState({wireframe: true});
            }
            elements.wireframe = wireframe;
        });
    },
    componentWillReceiveProps(props){
        var data = props.data;
        var i, state = {};
        if(data.wireframe){
            if(!this.state.wireframe) {
                stage.space.add(elements.wireframe);
                state.wireframe = true;
            }
        }
        else if(this.state.wireframe) {
            state.wireframe = false;
            stage.space.remove(elements.wireframe);
        }
        if(data.grid){
            if(!this.state.grid) {
                for(i = 0; i < elements.gridDots.length; i++){
                    stage.space.add(elements.gridDots[i]);
                }
            }
            state.grid = true;
        }
        else if(this.state.grid) {
            for(i = 0; i < elements.gridDots.length; i++){
                stage.space.remove(elements.gridDots[i]);
            }
            state.grid = false;
        }
        this.setState(state);
    },
    makeGrid(source){
        source.map(addGridDot);
    },
    getDotByVIndex(vIndex){
        for(var i = 0; i < elements.dots.length; i++){
            if(elements.dots[i].vIndex === vIndex) return elements.dots[i];
        }
    },
    updateVertex(vIndex, vertex){
        var face, line, i;
        setArrayPositionByVIndex(elements.gridDots, vIndex, vertex);
        setArrayPositionByVIndex(elements.dots, vIndex, vertex);
        setArrayPositionByVIndex(elements.markers, vIndex, vertex);
        for(i = 0; i < elements.lines.length; i++){
            line = elements.lines[i];
            if(line.vIndexA === vIndex) {
                setPosition(line.geometry.vertices[0], vertex);
                line.geometry.verticesNeedUpdate = true;
            }
            if(line.vIndexB === vIndex) {
                setPosition(line.geometry.vertices[1], vertex);
                line.geometry.verticesNeedUpdate = true;
            }
        }
        for(i = 0; i < elements.faces.length; i++){
            face = elements.faces[i];
            if(face.vIndexA === vIndex) {
                setPosition(face.geometry.vertices[0], vertex);
                face.geometry.verticesNeedUpdate = true;
            }
            if(face.vIndexB === vIndex) {
                setPosition(face.geometry.vertices[1], vertex);
                face.geometry.verticesNeedUpdate = true;
            }
            if(face.vIndexC === vIndex) {
                setPosition(face.geometry.vertices[2], vertex);
                face.geometry.verticesNeedUpdate = true;
            }
        }
    },
    componentDidMount(){
        stage = window.stage = Stage3d(this.getDOMNode());
        //elements.markers = make.markers(this.props.data.source[0]);
        //stage.onClick(elements.markers.dots, (marker)=>{
        //    console.log('marker');
        //});
        stage.onClick(elements.dots,(dot) => {
            console.log('dot');
            this.props.onVertexClick(dot.object.vIndex);

            return false;
        });
        stage.onClick(elements.gridDots,(gridDot) => {
            console.log('gridDot');
            this.props.onVertexClick(gridDot.object.vIndex);
        });
        this.props.onLoad(this);
    },
    render () {
        return (
            <div id="canvas" class="box"></div>
        );
    }
});