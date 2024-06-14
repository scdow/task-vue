const {defineConfig} = require('@Vue/cli-service')
module.exports = defineConfig({
  transpileDependencies:true,
  devServer:{
    port:7070,
    
    //Stop error resizeObserver
    client: {
      overlay: {
        runtimeErrors: (error) => {
          const ignoreErrors = [
            "ResizeObserver loop limit exceeded",
            "ResizeObserver loop completed with undelivered notifications.",
            "[eslint]",
          ];
          if (ignoreErrors.includes(error.message)) {
            return false;
          }
          return true;
        },
        warnings: false,  // 不显示警告
      },
    },

  }
})


