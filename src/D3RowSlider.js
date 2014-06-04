/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 6/3/14.
 */


/**
 *
 * @param spec
 * @constructor
 */
function D3RowSlider(spec){
    var that = this;
    /**
     * defines the xOffset
     * @type {number|*}
     */
    this.xOffset = spec.xOffset || -25;
    this.width = spec.width || 20;/** and some fun {@link D3RowSlider#xOffset}*/
    this.sliderOffsetTop = spec.sliderOffsetTop || spec.visOffsetTop || 20;
    this.sliderOffsetBtm = spec.sliderOffsetBtm|| spec.visOffsetBtm ||5;
    this.visOffsetTop = spec.visOffsetTop || 20;
    this.visOffsetBtm = spec.visOffsetBtm || 5;
    this.rowScale = spec.rowScale || d3.scale.linear();
    this.emitSignal = spec.emitSignal || "visUpdateRequired";
    this.sliderGroupName = spec.sliderGroupName || "sliderGroup";

    this.eventManager = spec.eventManager || {};
    this.parentPath = spec.parentPath || "svg";


    var mousePos={
        x:0,
        y:0
    }



    var maxRowScale = Math.max($(this.parentPath).height(),
            d3.max(this.rowScale.range())+this.rowScale.rangeBand());
    this.rowScaleMapping = d3.scale.linear().domain([0,maxRowScale]);
    this.getXPosition = function(){
        return (this.xOffset>=0)? this.xOffset: (($(window).width()+this.xOffset));
    }

    this.yScale  = d3.scale.linear()
        .range([0,($(this.parentPath).height()-this.sliderOffsetBtm-this.sliderOffsetTop)])
    this.brush = d3.svg.brush()
        .y(this.yScale)
        .extent([0,.5])
//        .on("brushstart", brushstart)
        .on("brush", function(){that.brushmove(that)})
//        .on("brushend", brushend);



    this.dataWindow = {
        minYTest:-this.rowScale.rangeBand(),
        minY:0,
        maxY:($(this.parentPath).height() - this.visOffsetBtm - this.visOffsetTop)
    }

    // -- save MousePos for scrolling
    $(window).mousemove(function(e){
        mousePos.x = e.pageX;
        mousePos.y = e.pageY;
    });

//    $(window).scroll(function(event){
////            console.log(mousePos, event);
//        var scrollAmount = $(window).scrollTop();
//        console.log(scrollAmount);
//    });


    $(this.parentPath).on('mousewheel', function(e){
        console.log(e.originalEvent.wheelDeltaY);

    })


}

D3RowSlider.prototype.appendSlider = function(){


    var bArea = d3.select(this.parentPath).append("g")
        .attr({
            class:this.sliderGroupName,
            "transform":"translate("+this.getXPosition()+","+this.sliderOffsetTop+")"
        }).call(this.brush)

    bArea.selectAll("rect").attr({
        width:20
    })
    bArea.select(".background").style({
        "visibility":null,
        "pointer-events":"none"
    })
    bArea.selectAll(".resize").remove()

    this.resizeWindow(false);
}


D3RowSlider.prototype.resizeWindow = function() {
    var maxRowScale = Math.max($(this.parentPath).height(),
        d3.max(this.rowScale.range())+this.rowScale.rangeBand());
    console.log("maxRowscale:", maxRowScale, this.rowScale.range(), this.rowScale.rangeBand());
    this.rowScaleMapping.domain([0,maxRowScale]);


    this.yScale
        .range([0,($(this.parentPath).height()-this.sliderOffsetBtm-this.sliderOffsetTop)]);

    this.dataWindow.maxY =
        this.dataWindow.minY
        + ($(this.parentPath).height()
        - this.visOffsetBtm - this.visOffsetTop);
    this.dataWindow.minYTest = this.dataWindow.minY-this.rowScale.rangeBand();


    var extSave = [this.rowScaleMapping(this.dataWindow.minY),
        this.rowScaleMapping(this.dataWindow.maxY)];
    console.log(extSave, this.dataWindow, this.rowScaleMapping.domain());
    this.brush.y(this.yScale).extent(extSave);

    d3.select("."+this.sliderGroupName).attr({
        "transform":"translate("+this.getXPosition()+","+this.sliderOffsetTop+")"
    })
        .call(this.brush)
        .selectAll(".resize").remove()

    if (!(arguments.length>0 && arguments[0]==false)){
        $(this.eventManager).trigger(this.emitSignal);
    }

};

D3RowSlider.prototype.brushmove = function(that){
//    console.log(that);
    var ex = that.brush.extent();
    that.dataWindow.minY = that.rowScaleMapping.invert(ex[0]);
    that.dataWindow.maxY = that.rowScaleMapping.invert(ex[1]);
    this.dataWindow.minYTest = this.dataWindow.minY-this.rowScale.rangeBand();


    $(that.eventManager).trigger(that.emitSignal);
    console.log("window:", that.dataWindow);

};


D3RowSlider.prototype.getDataWindow = function(){
    return this.dataWindow;
}

D3RowSlider.prototype.getFilterFunction = function(idSelector){
    var that = this
    return function(d){
        var yValue = that.rowScale(d[idSelector])
        return (yValue>that.dataWindow.minYTest) & ((yValue<that.dataWindow.maxY))
    }

}

