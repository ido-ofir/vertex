69+require('./style.css');

var data = window.data = require('./data');
var elements = window.elements = require('./elements.js');
var make = window.make = require('./make.js');
var utils = window.utils = require('./utils.js');
var half = data.source.length / 2;


var stage, canvas;
var source = localStorage.getItem('source');
var dots = localStorage.getItem('dots');
var lines = localStorage.getItem('lines');
var faces = localStorage.getItem('faces');

var Canvas = require('./Canvas.jsx');
var Controls = require('./Controls.jsx');
var Vertex = require('./Vertex.jsx');

var bgImage = "bg.png";
var image = "image.png";
data.showData = false;


function RVIndex(vIndex) {
    if(vIndex > half) return vIndex - half;
    return vIndex + half;
}

function getLowVIndex(vIndex) {
    if(vIndex > half) return vIndex - half;
    return vIndex;
}

function invertVertex(v) {
    return [-v[0], v[1], v[2]];
}

function removeFromArray(array, itemArray) {
    var k, similar = true;
    for(var i = 0; i < array.length; i++){
        similar = true
        for(k = 0; k < itemArray.length; k++) {
            if (array[i].indexOf(itemArray[k]) === -1) similar = false;
        }
        if(similar){
            array.splice(i, 1);
            return;
        }
    }
}

function addToStorage(name, item) {
    return;
    var c = localStorage.getItem(name);
    if(!c) c = [];
    console.dir(c);
    c.push(item);
    localStorage.setItem(name, c);
}
function removeFromStorage(name, item) {
    return;
    var c = localStorage.getItem(name);
    if(!c) return;
    console.dir(c);
    if(Array.isArray(item)){
        removeFromArray(c, item);
    }
    else{
        c.splice(c.indexOf(item));
    }
    localStorage.setItem(name, c);
}


var face = [];
var actions = [];
var history = [];

module.exports = React.createClass({

    getInitialState(){
        //if(source) data.source = source;
        //if(dots) data.dots = dots;
        //if(lines) data.lines = lines;
        //if(faces) data.faces = faces;
        return data;
    },
    componentDidMount(){
        document.body.addEventListener('keyup', (e)=>{
            if(e.keyCode === 27){  // esc
                this.removeMarkers();
                face = [];
            }
            else if(e.keyCode === 90){  // esc
                if(e.ctrlKey){
                    this.undo();
                }
            }
        }, false);
    },
    removeMarkers(vertex){
        var markers = this.state.markers;
        for(var i = 0; i < markers.length; i++){
            canvas.removeMarker(markers[i]);
        }
        this.setState({markers: []});
    },
    init(_canvas){
        canvas = _canvas;
        canvas.loadWireFrame({
            path: 'app/brain.js',
            color: '#828',
            opacity: 0.5,
            visible: true
        });
        // canvas.makeGrid(data.source);
        // if(data.dots.length){
        //     data.dots.forEach(canvas.addDot)
        // }
        // if(data.lines.length){
        //     data.lines.forEach((line)=>{
        //         canvas.addLine(line[0], line[1]);
        //     })
        // }
        // if(data.faces.length){
        //     data.faces.forEach(canvas.addFace)
        // }
        canvas.makeParticleSystem();
    },
    addDot(vIndex){
        var dots = this.state.dots;
        var symmetric = this.state.symmetric;
        var rvIndex = RVIndex(vIndex);
        console.dir(dots);
        if(canvas.hasDot(vIndex)) return;
        canvas.addDot(vIndex, {color: '#fff', vIndex: vIndex});
        dots.push(vIndex);
        addToStorage('dots', vIndex);
        if(symmetric){
            dots.push(rvIndex);
            canvas.addDot(rvIndex, {color: '#fff', vIndex: rvIndex});
            addToStorage('dots', rvIndex);
        }
        this.setState({ dots: dots });
    },
    addLine(vIndexA, vIndexB){
        var lines = this.state.lines;
        var symmetric = this.state.symmetric;
        var rvIndexA = RVIndex(vIndexA);
        var rvIndexB = RVIndex(vIndexB);
        if(canvas.hasLine(vIndexA, vIndexB)) return;
        canvas.addLine(vIndexA, vIndexB);
        lines.push([vIndexA, vIndexB]);
        addToStorage('lines', [vIndexA, vIndexB]);
        if(symmetric){
            canvas.addLine(rvIndexA, rvIndexB);
            lines.push([rvIndexA, rvIndexB]);
            addToStorage('lines', [rvIndexA, rvIndexB]);
        }
        this.setState({lines: lines});
    },
    addFace(face){
        face = [face[0], face[1], face[2]];
        var faces = this.state.faces;
        var symmetric = this.state.symmetric;
        var rFace = [RVIndex(face[0]), RVIndex(face[1]), RVIndex(face[2])];
        canvas.addFace(face);
        faces.push(face);
        addToStorage('faces', face);
        if(symmetric){
            canvas.addFace(rFace);
            faces.push(rFace);
            addToStorage('faces', rFace);
        }
        this.setState({faces: faces});
    },
    removeDot(vIndex){
        var dots = this.state.dots;
        var symmetric = this.state.symmetric;
        var rvIndex = RVIndex(vIndex);
        canvas.removeDot(vIndex);
        dots.splice(dots.indexOf(vIndex), 1);
        removeFromStorage('dots', vIndex);
        if(symmetric){
            canvas.removeDot(rvIndex);
            dots.splice(dots.indexOf(rvIndex), 1);
            removeFromStorage('dots', rvIndex);
        }
        this.setState({ dots: dots });
    },
    removeLine(vIndexA, vIndexB){
        var lines = this.state.lines;
        var symmetric = this.state.symmetric;
        var rvIndexA = RVIndex(vIndexA);
        var rvIndexB = RVIndex(vIndexB);
        canvas.removeLine(vIndexA, vIndexB);
        removeFromArray(lines, [vIndexA, vIndexB]);
        removeFromStorage('lines', [vIndexA, vIndexB]);
        if(symmetric){
            canvas.removeLine(rvIndexA, rvIndexB);
            removeFromArray(lines, [rvIndexA, rvIndexB]);
            removeFromStorage('lines', [rvIndexA, rvIndexB]);
        }
        this.setState({lines: lines});
    },
    removeFace(face){
        var faces = this.state.faces;
        var symmetric = this.state.symmetric;
        var rFace = [RVIndex(face[0]), RVIndex(face[1]), RVIndex(face[2])];
        canvas.removeFace(face);
        removeFromArray(faces, face);
        removeFromStorage('faces', face);
        if(symmetric){
            canvas.removeFace(rFace);
            removeFromArray(faces, rFace);
            removeFromStorage('faces', rFace);
        }
        this.setState({faces: faces});
    },

    action(type){
        var args = [].slice.call(arguments, 1);
        if(this[type]){
            actions.push({
                type: type,
                args: args
            });
            this[type].apply(this, args);
        }

    },
    undo(){
        var lastActions = history.pop();
        for(var i = lastActions.length-1; i >= 0; i--){
            if(lastActions[i].type === 'addDot') this.removeDot(lastActions[i].args[0]);
            else if(lastActions[i].type === 'addLine') this.removeLine(lastActions[i].args[0], lastActions[i].args[1]);
            else if(lastActions[i].type === 'addFace') this.removeFace(lastActions[i].args[0])
        }
    },
    onVertexClick(vIndex){
        console.log('vertex click');
        actions = [];
        face.push(vIndex);
        var markers = this.state.markers;
        if(!canvas.hasDot(vIndex)) this.action('addDot', vIndex);
        if(face.length === 2){
            if(!canvas.hasLine(face[0], face[1])) this.action('addLine', face[0], face[1]);
        }
        else if(face.length === 3){
            if(!canvas.hasLine(face[0], face[2])) this.action('addLine', face[0], face[2]);
            if(!canvas.hasLine(face[1], face[2])) this.action('addLine', face[1], face[2]);
            if(!canvas.hasFace(face)) this.action('addFace', face.concat());
        }
        else if(face.length > 3) {
            face.shift();
            if(!canvas.hasLine(face[0], face[2])) this.action('addLine', face[0], face[2]);
            if(!canvas.hasLine(face[1], face[2])) this.action('addLine', face[1], face[2]);
            if(!canvas.hasFace(face)) this.action('addFace', face.concat());
        }
        canvas.addMarker(vIndex);
        markers.push(vIndex);
        if(markers.length > 2){
            canvas.removeMarker(markers.shift());
        }
        if(actions.length) history.push(actions);
        this.setState({
            vIndex: vIndex,
            markers: markers
        });
    },

    toggleWireFrame(){
        this.setState({wireframe: !this.state.wireframe});
    },
    toggleGrid(){
        this.setState({grid: !this.state.grid});
    },
    toggleSymmetric(){
        this.setState({symmetric: !this.state.symmetric});
    },
    removeDotLinesAndFaces(vIndex){
      var vLine, vFace;
      var data = this.state;
      var rvIndex = RVIndex(vIndex);
      canvas.removeDot(vIndex);
      if(data.symmetric){
        canvas.removeDot(rvIndex);
      }
      data.dots = data.dots.filter((dot, index)=>{
        if(dot === vIndex){
          return false;
        }
        if(data.symmetric){
          if(dot === rvIndex){
            return false;
          }
        }
        return true;
      })
      data.lines = data.lines.filter((line, index)=>{
        if(line[0] === vIndex || line[1] === vIndex){
          canvas.removeLine(line[0], line[1]);
          return false;
        }
        if(data.symmetric){
          if(line[0] === rvIndex || line[1] === rvIndex){
            canvas.removeLine(line[0], line[1]);
            return false;
          }
        }
        return true;
      })
      data.faces = data.faces.filter((face, index)=>{
        if(face.indexOf(vIndex) > -1){
          canvas.removeFace(face);
          return false;
        }
        if(data.symmetric){
          if(face.indexOf(rvIndex) > -1){
            canvas.removeFace(face);
            return false;
          }
        }
        return true;
      })
        this.removeMarkers();
        face = [];
        this.setState(data);
    },
    toggleData(){
        if(!this.state.showData){
            var text = JSON.stringify(this.state);
            setTimeout(() => {
                this.refs.text.getDOMNode().value = text;
            }, 100);

        }
        this.setState({showData: !this.state.showData});
    },
    toggleImage(){
        this.setState({image: !this.state.image});
    },
    setVertex(vIndex, vertex){
        var rv, rvIndex, source = this.state.source;
        source[vIndex] = vertex;
        canvas.updateVertex(vIndex, vertex);
        if(this.state.symmetric){
            rvIndex = RVIndex(vIndex);
            rv = [ - vertex[0], vertex[1], vertex[2] ];
            source[rvIndex] = rv;
            canvas.updateVertex(rvIndex, rv);
        }
        this.setState({source: source});
    },
    getData(){
        try{
            var value = JSON.parse(this.refs.text.getDOMNode().value);
            if(value) this.execData(value);
        }
        catch(err){
            alert(err);
        }
    },
    execData(data){
        canvas.clear();
        data.dots.forEach((dot)=>{ canvas.addDot(dot)});
        data.lines.forEach((line)=>{ canvas.addLine(line[0], line[1])});
        data.faces.forEach((face)=>{ canvas.addFace(face)});
        this.setState(data);
    },
    renderData(){
        if(!this.state.showData) return;
        return (
            <div className="box" style={{ zIndex: 50 }}>
                <textarea style={{width: '100%', height: '100%'}} ref="text"></textarea>
                <button className="save-btn" onClick={ this.getData }> Ok </button>
            </div>
        );
    },
    renderImage(){
        if(!this.state.image) return;
        return (
            <div id="bd" className="box image" style={{ backgroundImage: `url(${image})`}}></div>
        );
    },
    render () {
        return (
            <div className="box">
                <div id="bd" className="box" style={{ backgroundImage: `url(${bgImage})`}}></div>
                { this.renderImage() }
                <Canvas onLoad={ this.init } data={ this.state } onVertexClick={ this.onVertexClick }/>
                <Controls data={ this.state }
                          setVertex={ this.setVertex }
                          toggleWireframe={ this.toggleWireFrame }
                          toggleGrid={ this.toggleGrid }
                          toggleData={ this.toggleData }
                          toggleImage={ this.toggleImage }
                          toggleSymmetric={ this.toggleSymmetric }
                          removeDotLinesAndFaces={ this.removeDotLinesAndFaces }
                          vIndex={ this.state.vIndex }/>
                { this.renderData() }
            </div>
        );
    }
});
