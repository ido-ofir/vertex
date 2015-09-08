
var elements = window.elements = require('./elements.js');
var make = window.make = require('./make.js');
var utils = window.utils = require('./utils.js');

var Stage3d = require('./Stage3d');
var three;

var buttonStyle = {
    padding: '6px 10px'
};

var faces = [];

var Face = require('./Face.jsx');
var Line = require('./Line.jsx');
var Vertex = require('./Vertex.jsx');
var PositionInput = require('./PositionInput.jsx');

function clean(data) {
    var source = data.source;
    var dots = data.dots;
    var lines = data.lines;
    var faces = data.faces;
    dots = dots.filter(function(dot, i){
        for(var k = (i + 1); k < dots.length; k++){
            if(dot === dots[k]) {
                console.log('clearing dot ' + dot);
                return false;
            }
        }
        return true;
    });
    lines = lines.filter(function(line, i){
        if(line[0] === line[1]) return false;
        if(dots.indexOf(line[0]) === -1 || dots.indexOf(line[1]) === -1 ) return false;
        for(var k = (i + 1); k < lines.length; k++){
            if((line[0] === lines[k][0]) && (line[1]=== lines[k][1])) {
                console.log('clearing line [' + line[0] + ', ' + line[1] + ']');
                return false;
            }
            if((line[0] === lines[k][1]) && (line[1]=== lines[k][0])) {
                console.log('clearing line [' + line[0] + ', ' + line[1] + ']');
                return false;
            }
        }
        return true;
    });
    faces = faces.filter(function(face, i){
        if(face[0] === face[1] || face.indexOf(face[2]) < 2) return false;
        if(dots.indexOf(face[0]) === -1 || dots.indexOf(face[1]) === -1  || dots.indexOf(face[2]) === -1) return false;
        for(var k = (i + 1); k < faces.length; k++){
            if((face.indexOf(faces[k][0]) > -1) && (face.indexOf(faces[k][1]) > -1) && (face.indexOf(faces[k][2]) > -1)) {
                console.log('clearing face [' + face[0] + ', ' + face[1] + ', ' + face[2] + ']');
                return false;
            }
        }
        return true;
    });
    data.dots = dots;
    data.lines = lines;
    data.faces = faces;
    return data;
}

module.exports = React.createClass({
    renderVertex(vIndex){
        var vertex = this.props.data.source[vIndex];
        if(!vertex) return;
        return (
            <div className="vertex">
                { vIndex }
                <div>
                    X <PositionInput value={ vertex[0] } onChange={ this.changeX }/>
                </div>
                <div>
                    Y <PositionInput value={ vertex[1] } onChange={ this.changeY }/>
                </div>
                <div>
                    Z <PositionInput value={ vertex[2] } onChange={ this.changeZ }/>
                </div>
                <div style={{background: '#ddd', height:'20px'}} onClick={ this.removeDot }>
                    Delete
                </div>
            </div>

        );
    },
    removeDot(){
        this.props.removeDotLinesAndFaces(this.props.vIndex);
    },
    changeX(v){
        var vIndex = this.props.vIndex;
        var vertex = this.props.data.source[vIndex];
        if(vertex) this.props.setVertex(vIndex, [v, vertex[1], vertex[2]]);
    },
    changeY(v){
        var vIndex = this.props.vIndex;
        var vertex = this.props.data.source[vIndex];
        if(vertex) this.props.setVertex(vIndex, [vertex[0], v, vertex[2]]);
    },
    changeZ(v){
        var vIndex = this.props.vIndex;
        var vertex = this.props.data.source[vIndex];
        if(vertex) this.props.setVertex(vIndex, [vertex[0], vertex[1], v]);

    },
    render () {
        var data = this.props.data;
        return (
            <div className="controls">
                <div onClick={ this.props.toggleWireframe } className={cx({"btn icon wirframe-icon": true, "active": data.wireframe})}></div>
                <div onClick={ this.props.toggleGrid } className={cx({"btn icon grid-icon": true, "active": data.grid})}></div>
                <div onClick={ this.props.toggleSymmetric } className={cx({"btn icon symmetric-icon": true, "active": data.symmetric})}></div>
                <div onClick={ this.props.toggleData } className={cx({"btn icon data-icon": true, "active": data.showData})}></div>
                <div onClick={ this.props.toggleImage } className={cx({"btn icon image-icon": true, "active": data.image})}></div>
                { this.renderVertex(this.props.vIndex) }
            </div>
        );
    }
});
