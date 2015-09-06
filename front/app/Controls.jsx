
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


module.exports = React.createClass({
    renderVertex(vIndex){
        var vertex = this.props.data.source[vIndex];
        if(!vertex) return;
        return (
            <div className="vertex">
                <div>
                    X <PositionInput value={ vertex[0] } onChange={ this.changeX }/>
                </div>
                <div>
                    Y <PositionInput value={ vertex[1] } onChange={ this.changeY }/>
                </div>
                <div>
                    Z <PositionInput value={ vertex[2] } onChange={ this.changeZ }/>
                </div>
            </div>

        );
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