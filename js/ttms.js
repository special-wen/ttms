//图片轮播
$(document).ready(function() {
    var length,
        currentIndex = 0,
        interval,
        hasStarted = false, //是否已经开始轮播
        t = 3000; //轮播时间间隔
    length = $('.slider-panel').length;
    //将除了第一张图片隐藏
    $('.slider-panel:not(:first)').hide();
    //将第一个slider-item设为激活状态
    $('.slider-item:first').addClass('slider-item-selected');
    //隐藏向前、向后翻按钮
    $('.slider-page').hide();
    //鼠标上悬时显示向前、向后翻按钮,停止滑动，鼠标离开时隐藏向前、向后翻按钮，开始滑动
    $('.slider-panel, .slider-pre, .slider-next').hover(function() {
        stop();
        $('.slider-page').show();
    }, function() {
        $('.slider-page').hide();
        start();
    });
    $('.slider-item').hover(function(e) {
        stop();
        var preIndex = $(".slider-item").filter(".slider-item-selected").index();
        currentIndex = $(this).index();
        play(preIndex, currentIndex);
    }, function() {
        start();
    });
    $('.slider-pre').unbind('click');
    $('.slider-pre').bind('click', function() {
        pre();
    });
    $('.slider-next').unbind('click');
    $('.slider-next').bind('click', function() {
        next();
    });
    /**
     * 向前翻页
     */
    function pre() {
        var preIndex = currentIndex;
        currentIndex = (--currentIndex + length) % length;
        play(preIndex, currentIndex);
    }
    /**
     * 向后翻页
     */
    function next() {
        var preIndex = currentIndex;
        currentIndex = ++currentIndex % length;
        play(preIndex, currentIndex);
    }
    /**
     * 从preIndex页翻到currentIndex页
     * preIndex 整数，翻页的起始页
     * currentIndex 整数，翻到的那页
     */
    function play(preIndex, currentIndex) {
        $('.slider-panel').eq(preIndex).fadeOut(500)
            .parent().children().eq(currentIndex).fadeIn(1000);
        $('.slider-item').removeClass('slider-item-selected');
        $('.slider-item').eq(currentIndex).addClass('slider-item-selected');
    }
    /**
     * 开始轮播
     */
    function start() {
        if (!hasStarted) {
            hasStarted = true;
            interval = setInterval(next, t);
        }
    }
    /**
     * 停止轮播
     */
    function stop() {
        clearInterval(interval);
        hasStarted = false;
    }
    //开始轮播
    start();
    });
//正在上映的电影的上传

$("#add").click(function () {
    $(".movie_add").fadeIn("slow");
})
$("#close").click(function () {
    $(".movie_add").fadeOut("slow");
})


(function ($) {
    $.fn.tabullet = function (options) {
        var defaults = {
            rowClass: '',
            columnClass: '',
            tableClass: 'table',
            textClass: 'form-control',
            editClass: 'btn btn-default',
            deleteClass: 'btn btn-danger',
            saveClass: 'btn btn-success',
            deleteContent: 'Delete',
            editContent: 'Edit',
            saveContent: 'Save',
            action: function () {
            }
        };
        options = $.extend(defaults, options);
        var columns = $(this).find('thead > tr th');
        var idMap = $(this).find('thead > tr').first().attr('data-tabullet-map');
        var metadata = [];
        columns.each(function (i, v) {
            metadata.push({
                map: $(v).attr('data-tabullet-map'),
                readonly: $(v).attr('data-tabullet-readonly'),
                type: $(v).attr('data-tabullet-type')
            });
        });
        var index = 0;
        var data = options.data;
        $(data).each(function (i, v) {
            v._index = index++;
        });
        var table = this;
        $(table).find("tbody").remove();
        var tbody = $("<tbody></tbody>").appendTo($(this));
        // INSERT
        var insertRow = $("<tr></tr>").appendTo($(tbody)).attr('data-tabullet-id', "-1");
        $(metadata).each(function (i, v) {
            if (v.type === 'delete') {
                var td = $("<td></td>").appendTo(insertRow);
                return;
            }
            if (v.type === 'edit') {
                var td = $("<td></td>")
                    .html('<button class="' + options.saveClass + '">' + options.saveContent + '</button>')
                    .attr('data-tabullet-type', 'save')
                    .appendTo(insertRow);
                td.find('button').click(function (event) {
                    var saveData = [];
                    var rowParent = td.closest('tr');
                    var rowChildren = rowParent.find('input');
                    $(rowChildren).each(function (ri, rv) {
                        saveData[$(rv).attr('name')] = $(rv).val();
                    });
                    options.action('save', saveData);
                    return;
                });
                return;
            }
            if (v.readonly !== 'true') {
                $('<td/>').html('<input type="text" name="' + v.map + '" class="' + options.textClass + '"/>')
                    .appendTo(insertRow);
            }
            else {
                $("<td/>").appendTo(insertRow);
            }
        });
        $(data).each(function (i, v) {
            var tr = $("<tr/>").appendTo($(tbody)).attr('data-tabullet-id', v[idMap]);
            $(metadata).each(function (mi, mv) {
                if (mv.type === 'delete') {
                    var td = $("<td/>")
                        .html('<button class="' + options.deleteClass + '">' + options.deleteContent + '</button>')
                        .attr('data-tabullet-type', mv.type)
                        .appendTo(tr);
                    td.find('button').click(function (event) {
                        tr.remove();
                        options.action('delete', $(tr).attr('data-tabullet-id'));
                    });
                }
                else if (mv.type === 'edit') {
                    var td = $("<td/>")
                        .html('<button class="' + options.editClass + '">' + options.editContent + '</button>')
                        .attr('data-tabullet-type', mv.type)
                        .appendTo(tr);
                    td.find('button').click(function (event) {
                        if ($(this).attr('data-mode') === 'edit') {
                            var editData = [];
                            var rowParent = td.closest('tr');
                            var rowChildren = rowParent.find('input');
                            $(rowChildren).each(function (ri, rv) {
                                editData[$(rv).attr('name')] = $(rv).val();
                            });
                            editData[idMap] = $(rowParent).attr('data-tabullet-id');
                            options.action('edit', editData);
                            return;
                        }
                        $(this).removeClass(options.editClass).addClass(options.saveClass).html(options.saveContent)
                            .attr('data-mode', 'edit');
                        var rowParent = td.closest('tr');
                        var rowChildren = rowParent.find('td');
                        $(rowChildren).each(function (ri, rv) {
                            if ($(rv).attr('data-tabullet-type') === 'edit' ||
                                $(rv).attr('data-tabullet-type') === 'delete') {
                                return;
                            }
                            var mapName = $(rv).attr('data-tabullet-map');
                            if ($(rv).attr('data-tabullet-readonly') !== 'true') {
                                $(rv).html('<input type="text" name="' + mapName + '" value="' + v[mapName] + '" class="' + options.textClass + '"/>');
                            }
                        });
                    });
                }
                else {
                    var td = $("<td/>").html(v[mv.map])
                        .attr('data-tabullet-map', mv.map)
                        .attr('data-tabullet-readonly', mv.readonly)
                        .attr('data-tabullet-type', mv.type)
                        .appendTo(tr);
                }
            });
        });
    };
})(jQuery);
