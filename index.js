const { execHooks } = require ( './hook' )

const TRESHOLD = 1000 * 5

// WPShellPlugin.js

function WPShellPlugin(options) {
  
  this.onBeforeCompile = options.onBeforeCompile
  this.lastUpdate = new Date()

  this.lastHookRun = {}
}

WPShellPlugin.prototype.callHook = function(hookName,compiler,callback) {
  
  const lastHookRun = this.lastHookRun [ hookName ]
  if ( lastHookRun && Date.now() - lastHookRun.getTime() < TRESHOLD )
  {
    return callback ()
  }

  this.lastHookRun[hookName] = new Date()

  if ( this[hookName] && this[hookName].length > 0 )
  {
    execHooks ( this [hookName] , callback )
  }
  else {
    callback ()
  }
};

WPShellPlugin.prototype.apply = function(compiler) {

  const plugin = this  
  compiler.plugin('before-compile',function(compiler,callback){    
    plugin.callHook ( 'onBeforeCompile' , compiler , callback )
  })

}


module.exports = WPShellPlugin;