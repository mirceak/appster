module.exports = {
   runtimeCompiler: true,
   chainWebpack: (config) => {
      config.plugin('html').tap((opts) => {
         opts[0].filename = './appster_index.html';
         return opts;
      });
   },
}