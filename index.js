const { execHook } = require ( './hook' )

// WPShellPlugin.js

function WPShellPlugin(options) {
  
  this.onBeforeCompile = options.onBeforeCompile
}

WPShellPlugin.prototype.apply = function(compiler) {
  console.log("WPShellPlugin - The apply compiler..." , compiler );

  const plugin = this
  compiler.plugin("run", function(compiler,callback) {
    console.log("WPShellPlugin - The compiler is starting to compile...");

    if ( plugin.onBeforeCompile.length > 0 )
    {
      Promise.all ( plugin.onBeforeCompile.map ( script => execHook ( script ) ) )
        .then ( result => {
          console.log ( 'WPShellPlugin - onBeforeCompile finished' , result )
          callback()
        } )
        .catch ( callback )
    }
    else
    {
      setTimeout(callback, 500);
    }
  });
}


module.exports = WPShellPlugin;