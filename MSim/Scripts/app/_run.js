$(function () {
    app.initialize();

    // Activate Knockout
    ko.validation.init({ grouping: { observable: false } });
    ko.applyBindings(app);

    //Setting up pager
    //pager.extendWithPage(app);
    //pager.start();
});
