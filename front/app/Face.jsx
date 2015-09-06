var elements = require('./elements');
var inputStyle = {
    width: '80px',
    margin: '6px'
};

var Face = React.createClass({
    componentDidMount(){
        var el = this.getDOMNode();
    },
    mouseEnter(){
        var face = elements.faces[this.props.index];
        face.material.color = {r: 1, g: 0, b: 0};
        face = elements.reverseFaces[this.props.index];
        face.material.color = {r: 1, g: 0, b: 0};
    },
    mouseLeave(){
        var face = elements.faces[this.props.index];
        face.material.color = {r: 0, g: 1, b: 0};
        face = elements.reverseFaces[this.props.index];
        face.material.color = {r: 0, g: 1, b: 0};
    },
    changeA(e){
        var value = e.target.value;
        this.props.onChange(0, this.props.index, value);
    },
    changeB(e){
        var value = e.target.value;
        this.props.onChange(1, this.props.index, value);
    },
    changeC(e){
        var value = e.target.value;
        this.props.onChange(2, this.props.index, value);
    },
    render(){
        return (
            <div className="line" onMouseEnter={ this.mouseEnter } onMouseLeave={ this.mouseLeave }>
                { this.props.index } <input type="text" value={ this.props.face[0] } onChange={ this.changeA } style={ inputStyle }/>
                <input type="text" value={ this.props.face[1] } onChange={ this.changeB } style={ inputStyle }/>
                <input type="text" value={ this.props.face[2] } onChange={ this.changeC } style={ inputStyle }/>
            </div>
        );
    }
});

module.exports = Face;