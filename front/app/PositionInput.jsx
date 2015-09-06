var elements = require('./elements');
var inputStyle = {
    width: '80px',
    margin: '6px'
};
var PositionInput = React.createClass({
    componentDidMount(){
        var el = this.getDOMNode();
    },
    wheel(e){
        var v = parseFloat(this.props.value);
        if(e.deltaY > 0){
            v = v + 0.1;
        }
        else if(e.deltaY < 0){
            v = v - 0.1;
        }
        else if(e.deltaX > 0){
            v = v + 0.01;
        }
        else if(e.deltaX < 0){
            v = v - 0.01;
        }
        this.props.onChange(v.toFixed(6));
    },
    change(e){
        this.props.onChange(e.target.value);
    },
    render(){
        return (
            <input type="text" onChange={ this.change } onWheel={ this.wheel } style={ inputStyle } value={ this.props.value }/>
        );
    }
});
module.exports = PositionInput;