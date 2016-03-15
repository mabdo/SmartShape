(function ($) {
    var container, matrix, methods = {
        afterLoad : function (options) {
            if ($.fn.pinbox.staticInfo.isRun === true) {
                return 1;
            }
            $.fn.pinbox.staticInfo.isRun = true;
            container = $(options.subcontainer + "." + options.newitemindicator, $(this));
            matrix = methods.buildMatrix.apply(this, [container, options]);
            methods.setPositions.apply(this, [matrix, options]);
            return container;
        },
        buildMatrix: function (containerArrs, options) {
            methods.reset();
            var matrix = [], subMatrix = [], matrixWidth = options.rowsize, counter = 0;
            $(containerArrs).each(function () {
                counter += 1;
                var pushObject = this;
                subMatrix.push(pushObject);

                if (counter === matrixWidth) {
                    counter = 0;
                    matrix.push(subMatrix);
                    subMatrix = [];
                }
       
            });
            if (subMatrix.length > 0) {
                matrix.push(subMatrix);
            }
            return matrix;
        },
        setPositions : function (matrix, options) {
            var CFlexObj = this;
            var staticInfo = $.fn.pinbox.staticInfo;
            var tools = methods;
            $(matrix).each(function (pos) {
                $(this).each(function (subPos) {
                    if (pos > 0) {
                        if(staticInfo.nextFillMatrixId !== false ) {
                            subPos = staticInfo.nextFillMatrixId;
                        }
                        var parent = pos -1;
                        var parentSubPos = subPos;
                        var parentObject = tools.getParentItem(subPos);
                        var topPos = tools.builPosPositionFromMaxParent( 
                            parentObject.top,
                            $(parentObject.height).outerHeight(true)
                            );
                        if(options.rtl !== false){
                            right = ( subPos * $(this).outerWidth(true) ) + 10;
                            $(this).css({
                                'position' : 'absolute',
                                'top': topPos + 'px', 
                                'left' : 'auto',
                                'right':right + 'px'
                            });
                        }else{
                            left = ( subPos * $(this).outerWidth(true) ) + 10;
                            $(this).css({
                                'position':'absolute',
                                'top': topPos + 'px', 
                                'right' : 'auto',
                                'left':left + 'px'
                            });
                        }
                        $(this).attr('subpos',subPos );
                        $(this).removeClass(options.newitemindicator);
                    } else {
                        
                        if(staticInfo.nextFillMatrixId != false) {
                            subPos = staticInfo.nextFillMatrixId;
                            
                        }
                        if( tools.getLastPosition(subPos) != false ) {
                            topPos = tools.getLastPosition(subPos);
                        } else {
                            topPos = 0;
                        }
                        if(options.rtl !== false){
                            right = (subPos * $(this).outerWidth(true)) + 10;
                            $(this).css({
                                'position':'absolute',
                                'top':topPos + 'px', 
                                'left' : 'auto',
                                'right':right + 'px'
                            });
                        } else {
                            left = (subPos * $(this).outerWidth(true)) + 10;
                            $(this).css({
                                'position':'absolute',
                                'top':topPos + 'px', 
                                'right' : 'auto',
                                'left':left + 'px'
                            });
                        }
                        $(this).removeClass(options.newitemindicator);
                    }
                    
                    tools.setParentItem(subPos, this, topPos);
                    tools.setLastPosition(subPos, topPos  + $(this).outerHeight(true) + 30);

                    if(staticInfo.firstRun != true) {
                        tools.checkV();
                    }
                });
                
                staticInfo.firstRun = false;
            });

            staticInfo.isRun = false; 
            
            return this;
        },

        getParentItem : function (subPosition) {
            return $.fn.pinbox.staticInfo.parentPosition[subPosition];
        },

        setParentItem : function (subPosition, outerHeight, positionTop) {
            $.fn.pinbox.staticInfo.parentPosition[subPosition] = {
                height:outerHeight, 
                top: positionTop
            };
        },

        checkV : function () {
            var minItem =  this.minItem($.fn.pinbox.staticInfo.lastScrollIndex);
            var maxItem =  this.maxItem($.fn.pinbox.staticInfo.lastScrollIndex);
            var diff = maxItem[1] - minItem[1];
       
            if($.fn.pinbox.staticInfo.containerMaxDiff <= diff ) {
                $.fn.pinbox.staticInfo.nextFillMatrixId = minItem[0];
            } else {
                $.fn.pinbox.staticInfo.nextFillMatrixId = false;
            }
        },

        maxItem : function(ar) {
            var max  = ar[0];
            var maxi = 0
            for (var i = 1; i < ar.length; i++) {
                if (ar[i] > max) {
                    max = ar[i];
                    maxi=i;
                }
            }
            return Array(maxi,max);
        },

        minItem : function(ar) {
            var max  = ar[0];
            var maxi = 0
            for (var i = 1; i < ar.length; i++) {
                if (ar[i] < max) {
                    max = ar[i];
                    maxi=i;
                }
            }
            return Array(maxi,max);
        },

        getLastPosition : function (index) {
            if($.fn.pinbox.staticInfo.lastScrollIndex == false || $.fn.pinbox.staticInfo.lastScrollIndex[index] === undefined) {
                return false;
            } else {
                return $.fn.pinbox.staticInfo.lastScrollIndex[index]; 
            }
     
        },

        setLastPosition : function (index,position) {

            if($.fn.pinbox.staticInfo.lastScrollIndex == false) {
                $.fn.pinbox.staticInfo.lastScrollIndex = [];
            }
    
            $.fn.pinbox.staticInfo.lastScrollIndex[index] = position;
        },
        reset : function(){
            $.fn.pinbox.staticInfo.lastScrollIndex = [];
            $.fn.pinbox.staticInfo.parentPosition = [];
        },
        builPosPositionFromMaxParent : function (top, height) {
            return top + height + 30;
        },
        destroy : function( ) {
            return this.each(function(){
                var $this = $(this),
                data = $this.data('tooltip');
                $(window).unbind('.tooltip');
                data.tooltip.remove();
                $this.removeData('tooltip');

            })

        }
   
    };
    $.fn.pinbox = function (options) {
        var opts = jQuery.extend({}, $.fn.pinbox.defaults, options);

        return methods.afterLoad.apply(this, [ opts ]);
    };
    $.fn.pinbox.staticInfo = {
        isRun : false,
        lastScrollIndex : false,
        containerMaxDiff : 500,
        nextFillMatrixId : false,
        parentPosition :[],
        firstRun :true
    };
    
    // $.fn.pinbox.defaults.newitemindicator 

    $.fn.pinbox.defaults =  {
        newitemindicator : "new",
        subcontainer : ".prodcont",
        rowsize : 5,
        rtl : false,
    };
})( jQuery );


