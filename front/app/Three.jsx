var data = window.data = require('./data');
var elements = window.elements = require('./elements.js');
var make = window.make = require('./make.js');
var utils = window.utils = require('./utils.js');
var half = data.vertices.length / 2;
var Stage3d = require('./Stage3d');
var three;

var buttonStyle = {
    position: 'absolute',
    top: '6px',
    right: '6px',
    padding: '6px 10px'
};

var faces = [];


var Face = require('./Face.jsx');
var Line = require('./Line.jsx');
var Vertex = require('./Vertex.jsx');



module.exports = React.createClass({
    getInitialState(){
        return data;
    },

    toggleVertex(vertex, index){

    },
    renderVertex(vertex, index){
        if(index >= (data.source.length / 2)) return;
        return (
            <Vertex vertex={ vertex } index={ index } toggle={ this.toggleVertex }/>

        );
    },
    renderFace(face, index){
        return (
            <Face face={ face } index={ index } onChange={ this.onFaceChange }/>

        );
    },
    makeFace(indexA, indexB, indexC){
        var faces = this.state.faces;
        var vertices = this.state.vertices;
        var a = vertices[indexA];
        var ar = vertices[half + indexA];
        var b = vertices[indexB];
        var br = vertices[half + indexB];
        var c = vertices[indexC];
        var cr = vertices[half + indexC];
        make.face(a, b, c);
        make.face(ar, br, cr);
    },
    onFaceChange(axis, index, value){
        var half = (data.vertices.length / 2);
        var faces = this.state.faces;
        var vertices = this.state.vertices;
        var face = faces[index];
        face[axis] = value;
        var a = vertices[face[0]];
        var reverseA = data.vertices[(parseInt(face[0]) + half)];
        var b = vertices[face[1]];
        var reverseB = data.vertices[(parseInt(face[1]) + half)];
        var c = vertices[face[2]];
        var reverseC = data.vertices[(parseInt(face[2]) + half)];
        var faceElement = elements.faces[index];
        var reverseFaceElement = elements.reverseFaces[index];
        if(faceElement && a && b && c){
            //console.dir(lineElement.geometry.vertices[isEndPoint]);
            three.space.remove(faceElement);
            three.space.remove(reverseFaceElement);
            var newFace = make.face(a, b, c);
            var newReverseFace = make.face(reverseA, reverseB, reverseC, true);
            elements.faces[index] = newFace;
            elements.reverseFaces[index] = newReverseFace;
            three.space.add(newFace);
            three.space.add(newReverseFace);
        }
        this.setState({faces: faces})

    },
    toggleWireframe(){
        var wireframe = !this.state.wireframe;
        if(wireframe){
            three.space.add(elements.wireframe);
        }
        else{
            three.space.remove(elements.wireframe);
        }
        this.setState({wireframe: wireframe});
    },
    render () {
        var source = this.state.source;
        var vertices = this.state.vertices;
        var lines = this.state.lines;
        var faces = this.state.faces;
        return (
            <div className="box">
                <div className="vertices">
                    <div className="header">vertices</div>
                    <button style={ buttonStyle } onClick={ this.toggleWireframe }>wireframe</button>
                    <div className="box" style={{top: '40px', overflow: 'auto'}}>
                        { source.map(this.renderVertex) }
                    </div>
                </div>
                <div className="lines">

                    <div className="header">
                        lines
                    </div>
                    <button style={ buttonStyle }>add</button>
                    <div className="box" style={{top: '40px', overflow: 'auto'}}>

                    </div>
                </div>
                <div className="faces">
                    <div className="header">faces</div>
                    <button style={ buttonStyle } onClick={ this.makeFace }>add</button>
                    <div className="box" style={{top: '40px', overflow: 'auto'}}>
                        { faces.map(this.renderFace) }
                    </div>
                </div>
                {
                    ()=>{
                        if(false){
                            return (
                                <div className="box">
                                    <textarea className="box" style={{width: '100%', zIndex: 1}}></textarea>
                                </div>
                            );
                        }
                    }
                }
            </div>
        );
    }
});





