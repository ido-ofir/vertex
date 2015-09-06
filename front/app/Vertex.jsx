var elements = require('./elements.js');
var PositionInput = require('./PositionInput.jsx');
var inputStyle = {
    width: '80px',
    margin: '6px'
};
var Vertex = React.createClass({
    getInitialState(){
        return {
            x: this.props.vertex[0],
            y: this.props.vertex[1],
            z: this.props.vertex[2]
        };
    },
    changeX(v){
        var vertex = this.props.vertex;
        this.props.onChange([v, vertex[1], vertex[2]]);
    },
    changeY(v){
        var vertex = this.props.vertex;
        this.props.onChange([vertex[0], v, vertex[2]]);
    },
    changeZ(v){
        var vertex = this.props.vertex;
        this.props.onChange([vertex[0], vertex[1], v]);
    },
    render(){
        return (
            <div className="vertex">
                { this.props.vIndex }
                <PositionInput value={ this.props.vertex[0] } onChange={ this.changeX }/>
                <PositionInput value={ this.props.vertex[1] } onChange={ this.changeY }/>
                <PositionInput value={ this.props.vertex[2] } onChange={ this.changeZ }/>
            </div>
        );
    }
});

module.exports = Vertex;