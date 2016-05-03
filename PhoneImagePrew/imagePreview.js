///<reference path="Image.html">


(function ($) {
    $.dyMobilePrew = $.fn.dyMobilePrew = function (options) {
        opts = $.extend({}, $.fn.dyMobilePrew.defaults, options);

        opts.imgSrcs = opts.imgSrcs || [];
        if (opts.imgObj)
        {
            $(opts.imgObj).each(function () {
                
                if ($(this).attr("src"))
                    opts.imgSrcs.push($(this).attr("src"));
            });
        }

        if (this instanceof jQuery)
        {
            opts.imgObj=$(this);
        }

        createModal();

        return this;
    }
    
    $.dyMobilePrew.opts = this.opts;
    $.dyMobilePrew.imgGuid = this.imgGuid = 0;

    var bodyOverFlowX, bodyOverFlowY;

    ///创建 模态框
    $.dyMobilePrew.createModal = this.createModal = function () {
        $("body").append('\
            <div id="imageModal" style="display:none;position:fixed;opacity:1;background-color:black;top:0px;left:0px;right:0px;bottom:0px;">\
                <div id="imageHead" style="border-bottom: 1px solid white;height:20px;z-index:9999;background-color:black;position:absolute;top:0;left:0;right:0;"></div>\
                <div id="imageBody" style="position:relative;overflow: scroll;height:' + (window.innerHeight - 42) + 'px;margin-top: 21px;"></div>\
                <div id="imageFooter" style="border-top:1px solid white;height:20px;position:fixed;bottom:0px;left:0px;right:0px;background-color:black;"></div>\
            </div>');

        bodyOverFlowX = $("body").css("overflow-x");
        bodyOverFlowY = $("body").css("overflow-y");

        $("<button>关闭</button>").click(function () {
            closeModal();
        }).appendTo("#imageModal #imageFooter");
        
        if (opts.imgObj.length > 0) {
            opts.imgObj.each(function () {
                $(this).attr("guid", $.dyMobilePrew.imgGuid);

                var jqImg = $("<img style='display:none;width: 100%;opacity: 1;position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);' src='" + $(this).attr("src") + "' imgguid='" + ($.dyMobilePrew.imgGuid++) + "'/>");
                jqImg.appendTo("#imageModal>#imageBody");
            });

            opts.imgObj.click(function () {//略缩图点击，进行预览
                openModal();
                $("#imageModal>#imageBody [imgguid=" + $(this).attr("guid") + "]").show();

                var total = $("#imageModal>#imageBody [imgguid]").length;
                var index = $("#imageModal>#imageBody [imgguid]").index($("#imageModal>#imageBody [imgguid=" + $(this).attr("guid")+"]")) + 1;
                $("#imageModal>#imageHead").html("<p class='imgaeIndex' style='color:white;'>" + index + "/" + total + "</p>");
                return;
            });

        }
        else if (opts.imgSrcs.length>0) {
            opts.imgSrcs.forEach(function (item) {
                var jqImg = $("<img style='display:none;width: 100%;opacity: 1;position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);' src='" + item + "' imgguid='" + ($.dyMobilePrew.imgGuid++) + "'/>");
                jqImg.appendTo("#imageModal>#imageBody");
            });
        }

        $("#imageModal>#imageBody img[imgguid]").each(function(){
            $(this).click(function (e) {//.dblclick(function () {
                var winW = $(this).closest("#imageBody").width(); //图片容器的高宽
                var winH = $(this).closest("#imageBody").height();
                var imgW = $(this).width();//点击图片时的图片宽度
                var imgH = $(this).height();//点击图片时的图片宽度
           
                var mouseX = e.offsetX;
                var mouseY = e.offsetY;

                if (winW == imgW) { //放大
                    var tranX =tranY= "-50%";
                    $(this).css({ "width": "auto" });

                    if (winW < $(this).width()) { //如果图片的真实宽度大于窗口的宽度
                        $(this).css({ left: "0" });
                        tranX = "0";
                    }
                    if (winH < $(this).height()) { //如果图片的真实高度大于窗口的高度
                        $(this).css({ top: "0" });
                        tranY = "0";
                    }
                    $(this).css("transform", "translate("+tranX+","+tranY+")");

                    var scrollL = ($(this).width() - winW) *(mouseX/imgW);
                    var scrollT = ($(this).height() - winH) *(mouseY/imgH);
                    if(scrollL>0)
                        $(this).parent().scrollLeft(scrollL);
                    if(scrollT>0)
                        $(this).parent().scrollTop(scrollT);
                }
                else {   //缩小
                    $(this).width(winW).css({ position: "absolute",left:"50%",top:"50%", "transform": "translate(-50%,-50%)" });
                }

                return false;
            });
        });
             
    };  // /

    //打开 模态框
    $.dyMobilePrew.openModal=this.openModal  = function ()
    {
        $("body>div#imageModal").show();
        $("body").css("overflow", "hidden");
    }

    //关闭 模态框
    $.dyMobilePrew.closeModal = this.closeModal = function () {
        $("body>div#imageModal").hide();
        $("body>div#imageModal img").hide();
        if(bodyOverFlowX)
            $("body").css("overflow-x",bodyOverFlowX);
        if(bodyOverFlowY)
            $("body").css("overflow-y", bodyOverFlowY);
    }

    $.fn.dyMobilePrew.defaults = {
        imgObj: null,
        imgSrcs :[]
    };
})(jQuery);


