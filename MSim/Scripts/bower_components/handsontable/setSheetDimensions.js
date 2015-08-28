(function () {
    var containerWidth = $('.container').outerWidth(),
        containerHeight = $('.body-content').outerHeight(),
        totalWidth = $('body').outerWidth(),
        diff = totalWidth - containerWidth,
        marg = -Math.floor(diff / 3),
        sheetWidth = containerWidth + -marg*2 + 'px',
        sheetHeight = containerHeight + 80 + 'px';
    $("#adminsheet").css({ "margin-left": marg, "margin-right": marg });
    $(".scroll-container").css({ "width": sheetWidth, "height": sheetHeight });
})();