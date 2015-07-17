$(function () {
    app.initialize();

    // Activate Knockout
    ko.validation.init({ grouping: { observable: false } });
    pager.extendWithPage(app);
    ko.applyBindings(app);
    pager.start();
});
