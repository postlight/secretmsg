package ui

type state map[string]interface{}

// Context gives all components access to shared state.
type Context struct {
	currTree    Node
	needsUpdate bool
	store       state
}

// NewContext creates a new context pointer.
func NewContext() *Context {
	return &Context{
		needsUpdate: false,
		store:       state{},
	}
}

// Update should be called whenever state of the app changes, queueing up a DOM update
func (cc *Context) Update() {
	cc.needsUpdate = true
}

// Get retrieves a value from the context store for the given key.
func (cc *Context) Get(key string) (interface{}, bool) {
	val, ok := cc.store[key]
	return val, ok
}

// Set stores a value in context.
func (cc *Context) Set(key string, val interface{}) {
	cc.store[key] = val
}
