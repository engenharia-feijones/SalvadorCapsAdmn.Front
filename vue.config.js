module.exports = {
    chainWebpack: config => {
        config.module.rules.delete('eslint');
        config
            .plugin('html')
            .tap(args => {
                args[0].title = "Salvador Caps";
                return args;
            })
    }
}