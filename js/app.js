(function () {
    function init() {
        var router = new Router([
            new Route('home', true),
            new Route('trackers'),
            new Route('audits')
        ]);
    }
    init();
}());