module.exports = {
  chainWebpack: config => {
    config.module.rules.delete('eslint');
    config
        .plugin('html')
        .tap(args => {
            args[0].title = "ADM Salvador Caps";
            return args;
        })
},
  transpileDependencies: [
    'vuetify'
  ]
}
