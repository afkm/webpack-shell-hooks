const shelljs = require ( 'shelljs' )

const execHook = ( hookCommand ) => new Promise ( ( resolve , reject ) => {

  const child = shelljs.exec ( hookCommand , {async: true } )

  const result = {
    done: false,
    data: [],
    error: null
  }

  const bail = ( error ) => {
    if ( !result.done )
    {
      result.done = true
      result.error = error
      reject ( error )
    }
  }

  const respond = () => {
    if ( !result.done )
    {
      result.done = true
      resolve(result)
    }
  }

  child.stdout.on('data',(data)=>{
    result.data.push(data.toString('utf8'))
  })

  child.stderr.on('data',(data)=>{
    bail(data.toString('utf8'))

  })

  child.on('error',(error) => {
    bail(error)
  })

  child.on ('close',(code,signal)=>{
    if ( code === 0 )
    {
      respond()
    }
    else {
      bail(`${hookCommand} failed with code: ${code}.` )
    }
  })

})

const execHooks = ( commands , callback ) => {

  if ( commands.length === 0 )
    callback ()
  else{
    const next = commands[0]
    const label = 'WPShellHooks('+next+')'
    console.time(label)
    execHook ( next )
      .then ( result => {
        console.timeEnd(label)
        execHooks ( commands.slice(1) , callback )
      } )
      .catch ( callback )
  }

}

module.exports = {
  execHook,
  execHooks
}