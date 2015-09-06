var elements = require('./elements');
var inputStyle = {
    width: '80px',
    margin: '6px'
};
var Line = React.createClass({
    componentDidMount(){
        var el = this.getDOMNode();
    },
    mouseEnter(){
        var line = elements.lines[this.props.index];
        line.material.color = {r: 1, g: 0, b: 0};
        line = elements.reverseLines[this.props.index];
        line.material.color = {r: 1, g: 0, b: 0};
    },
    mouseLeave(){
        var line = elements.lines[this.props.index];
        line.material.color = {r: 1, g: 1, b: 1};
        line = elements.reverseLines[this.props.index];
        line.material.color = {r: 1, g: 1, b: 1};
    },
    changeA(e){
        var value = e.target.value;
        this.props.onChange(0, this.props.index, value);
    },
    changeB(e){
        var value = e.target.value;
        this.props.onChange(1, this.props.index, value);
    },
    render(){
        return (
            <div className="line" onMouseEnter={ this.mouseEnter } onMouseLeave={ this.mouseLeave }>
                { this.props.index } <input type="text" value={ this.props.line[0] } onChange={ this.changeA } style={ inputStyle }/>
                <input type="text" value={ this.props.line[1] } onChange={ this.changeB } style={ inputStyle }/>
            </div>
        );
    }
});

module.exports = Line;