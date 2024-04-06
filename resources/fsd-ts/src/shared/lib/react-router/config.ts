export const pathKeys = {
    root: '/',
    login() {
        return pathKeys.root;
    },
    home() {
        return pathKeys.root.concat('home/');
    },
    settings() {
        return pathKeys.root.concat('settings/');
    },
    configs() {
        return pathKeys.root.concat('configs/');
    },
    titles: {
        root() {
            return pathKeys.root.concat('titles/');
        },
        create() {
            return pathKeys.titles.root().concat('create');
        },
    },
    switchers() {
        return pathKeys.root.concat('switchers/');
    },
    scenarios: {
        root() {
            return pathKeys.root.concat('scenarios/');
        },
        view() {
            return pathKeys.scenarios.root().concat('scenarios-view/');
        },
        add() {
            return pathKeys.scenarios.root().concat('scenario-add/');
        },
    },
    page404() {
        return pathKeys.root.concat('404/');
    },
};
