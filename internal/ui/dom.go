package ui

import (
	"syscall/js"
)

// Document represents the window's document object.
type Document struct {
	js js.Value
}

// Element represents a DOM element.
type Element struct {
	js js.Value
}

// DOMEvent represents all types of DOM event objects.
type DOMEvent struct {
	js     js.Value
	Target js.Value
}

// EventHandler is a callback function for js events.
type EventHandler func(*DOMEvent)

// Attr map of DOM element attributes used when defining nodes in components,
// i.e. id, class, href, type etc.
type Attr map[string]string

// Listeners map of event handlers used when defining nodes in components.
type Listeners map[string]EventHandler

// GetDocument returns a document pointer.
func GetDocument() *Document {
	doc := js.Global().Get("document")
	return &Document{js: doc}
}

// Body returns the document's body element.
func (d *Document) Body() *Element {
	return &Element{js: d.js.Get("body")}
}

// CreateElement creates a new DOM element and adds event listeners.
func (d *Document) CreateElement(tag string, attributes Attr, listeners Listeners) *Element {
	domEl := d.js.Call("createElement", tag)
	for k, v := range attributes {
		domEl.Call("setAttribute", k, v)
	}
	el := &Element{js: domEl}
	for event, handler := range listeners {
		el.Listen(event, handler)
	}
	return el
}

// CreateTextNode creates a new text node.
func (d *Document) CreateTextNode(text string) *Element {
	el := d.js.Call("createTextNode", text)
	return &Element{js: el}
}

// Append another element to this element.
func (e *Element) Append(child *Element) *Element {
	e.js.Call("appendChild", child.js)
	return e
}

// Listen to events on an element.
func (e *Element) Listen(name string, handler EventHandler) {
	var cbflags js.EventCallbackFlag
	// TODO: Need a way to add these options to listeners
	// if preventDef {
	// 	cbflags = cbflags + js.PreventDefault
	// }
	// if stopProp {
	// 	cbflags = cbflags + js.StopPropagation
	// }
	e.js.Call("addEventListener", name, js.NewEventCallback(cbflags, func(v js.Value) {
		handler(&DOMEvent{js: v, Target: v.Get("target")})
	}))
}

// ExposeMethod adds a namespaced function to the window object, allowing you to call
// Go functions from JavaScript.
func ExposeMethod(namespace string, method string, callback func([]js.Value)) {
	if ns := js.Global().Get(namespace); ns.Type() != js.TypeUndefined {
		ns.Set(method, js.NewCallback(callback))
	} else {
		js.Global().Set(namespace, map[string]interface{}{method: js.NewCallback(callback)})
	}
}

// GetLocation retrieves the page's current URL.
func GetLocation() string {
	return js.Global().Get("location").Get("href").String()
}

// RequestFrame passes a callback function to the window's requestAnimationFrame method.
func RequestFrame(callback func([]js.Value)) {
	js.Global().Call("requestAnimationFrame", js.NewCallback(callback))
}
