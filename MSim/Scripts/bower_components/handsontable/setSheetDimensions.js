(function () {
    var containerWidth = $('#container').outerWidth(),
        containerHeight = $('#container').outerHeight(),
        totalWidth = $('body').outerWidth(),
        diff = totalWidth - containerWidth,
        marg = -Math.floor(diff / 3) + 'px',
        sheetWidth = containerWidth + -marg*2 + 'px',
        sheetHeight = containerHeight + 80 + 'px';
    $("#adminsheet").css({ "margin-left": marg, "margin-right": marg });
    $(".scroll-container").css({ "width": sheetWidth, "height": sheetHeight });
})();