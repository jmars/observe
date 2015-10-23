let Watched = []

let Callback = Symbol('observe:callback')
let Pending = Symbol('observe:pending')

function Descriptor (name, object, callback) {
  return Object.seal(Object.assign(Object.create(null, {
    [Callback]: { value: callback },
    name: { value: name, enumerable: true },
    object: { value: object, enumerable: true }
  }), {
    type: '',
    oldValue: object[name]
  }))
}

export function observe (object, callback) {
  if (Object.observe) return Object.observe(object, callback)
  object[Pending] = []
  Watched = Watched.concat(Object.keys(object).map(key => {
    return Descriptor(key, object, callback)
  }))
}

export function unobserve (object, callback) {
  if (Object.unobserve) return Object.unobserve(object, callback)
  Watched = Watched.reduce((acc, curr) => {
    if (curr.object !== object && curr[Callback] !== callback) {
      acc.push(curr)
    }
    return acc
  }, [])
}

export function notify () {
  if (Object.observe) return
  Watched = Watched.reduce((acc, desc) => {
    let newVal = desc.object[desc.name]
    if (desc.oldValue !== newVal) {
      desc.object[Pending].push(desc)
      if (newVal === undefined) {
        desc.type = 'delete'
        return
      } else {
        desc.type = 'update'
      }
    }
    acc.push(desc)
    return acc
  }, [])
  Watched.forEach(desc => {
    if (!desc.object[Pending].length) return
    desc[Callback](desc.object[Pending])
    desc.object[Pending].length = 0
  })
}

let interval = null

export function start () {
  if (Object.observe) return
  interval = setInterval(notify, 100)
}

export function stop () {
  if (Object.observe) return
  clearInterval(interval)
}
