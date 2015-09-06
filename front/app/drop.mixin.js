module.exports = {
    dragEnter(e){
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        //elem.addClass('drag-over');
    },
    dragLeave(e){
        //elem.removeClass('drag-over');
    },
    dragEnd(e){
        //elem.removeClass('drag-over');
    },
    dragOver(e){
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    },
    drop(){
        var transfer = e.dataTransfer;
        var fragment = transfer.getData('fragment');
        console.log('drop');
        //if(attrs.fragmentDrop){
        //    drop = scope[attrs.fragmentDrop];
        //    if(drop) drop(fragment);
        //    else console.log(attrs);
        //
        //}
        //else if(fragment.markup){
        //    //console.dir($scope);
        //    scope.$apply(function(){
        //        var jsonMarkup = fragmentSrv.htmlToJSON(fragment.markup);
        //        var link = $compile(fragment.markup);
        //        var markup = link(scope);
        //        elem.append(markup);
        //    });
        //}
        //elem.removeClass('drag-over');
        e.stopPropagation();
        e.preventDefault();
    },
    componentDidMount(){
        var elem =  React.getDOMNode(this);
        elem.addEventListener('dragenter', this.dragEnter, false);
        elem.addEventListener('dragleave', this.dragLeave, false);
        elem.addEventListener('dragend', this.dragEnd, false);
        elem.addEventListener('dragover', this.dragOver, false);
        elem.addEventListener('drop', this.drop, false);
    },
    componentWillUnmount(){
        var elem =  React.getDOMNode(this);
        elem.removeEventListener('dragenter', this.dragEnter, false);
        elem.removeEventListener('dragleave', this.dragLeave, false);
        elem.removeEventListener('dragend', this.dragEnd, false);
        elem.removeEventListener('dragover', this.dragOver, false);
        elem.removeEventListener('drop', this.drop, false);
    }
};