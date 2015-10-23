import assert from 'assert'
import { observe, unobserve, notify } from '../src'

describe('Observe', () => {
  it('should notify of any property changes', (done) => {
    let test = { foo: 1 }
    let descriptor = {}
    observe(test, changes => {
      assert(changes.length, 1)
      descriptor = changes[0]
    })
    test.foo = 2
    notify()
    setImmediate(() => {
      assert.deepEqual(descriptor, {
        type: 'update',
        object: test,
        name: 'foo',
        oldValue: 1
      })
      done()
    })
  })
})