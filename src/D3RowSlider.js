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



    var mousePos={
        x:0,
        y:0
    }



    this.rowScaleMapping = d3.scale.linear().domain(d3.extent(this.rowScale.range()));
    this.getXPosition = function(){
        return (this.xOffset>=0)? this.xOffset: (($(window).width()+this.xOffset));
    }

    this.yScale  = d3.scale.linear()
        .range([0,($(window).height()-this.sliderOffsetBtm-this.sliderOffsetTop)])
    this.brush = d3.svg.brush()
        .y(this.yScale)
        .extent([0,.5])
//        .on("brushstart", brushstart)
        .on("brush", function(){that.brushmove(that)})
//        .on("brushend", brushend);



    this.dataWindow = {
        minY:0,
        maxY:($(window).height() - this.visOffsetBtm - this.visOffsetTop)
    }

    // -- save MousePos for scrolling
    $(window).mousemove(function(e){
        mousePos.x = e.pageX;
        mousePos.y = e.pageY;
    });

    $(window).scroll(function(event){
//            console.log(mousePos, event);
        var scrollAmount = $(window).scrollTop();
        console.log(scrollAmount);
    });




}

D3RowSlider.prototype.fun = function () {

}



