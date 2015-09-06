var data = window.data = require('./data');
var elements = window.elements = require('./elements.js');
var make = window.make = require('./make.js');
var utils = window.utils = require('./utils.js');
var half = data.vertices.length / 2;
var Stage3d = require('./Stage3d');
var three;

var buttonWrapStyle = {
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
    renderVertex(vIndex, index){
        if(index >= (this.props.data.source.length / 2)) return;
        var vertex = this.props.data.source[vIndex];
        return (
            <Vertex vertex={ vertex } onChange={ this.props.setVertex.bind(null, vIndex) }/>

        );
    },
    renderFace(face, index){
        return (
            <Face face={ face } index={ index } onChange={ this.props.onFaceChange }/>

        );
    },
    render () {
        var data = this.props.data;
        var source = data.source;
        var vertices = data.vertices;
        var faces = data.faces;
        return (
            <div className="controls">
                <div className="vertices">
                    <div className="header">source</div>
                    <div style={ buttonWrapStyle }>
                        <button onClick={ this.props.toggleWireframe }>wireframe</button>
                        <button onClick={ this.props.toggleMode }>{ this.props.data.mode }</button>
                        <button onClick={ this.props.toggleGrid }>grid</button>
                    </div>
                    <div className="box" style={{top: '40px', overflow: 'auto'}}>

                    </div>
                </div>
                <div className="lines">

                    <div className="header">
                        vertices
                    </div>
                    <div className="box" style={{top: '40px', overflow: 'auto'}}>
                        { vertices.map(this.renderVertex) }
                    </div>
                </div>
                <div className="faces">
                    <div className="header">faces</div>
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