package ui

type transform interface {
	apply(*Context)
}

type addNodeTransform struct {
	parent *Element
	target Node
}

func (t addNodeTransform) apply(ctx *Context) {
	doc := GetDocument()
	node := build(t.target, ctx)
	node.Mount(doc, t.parent, ctx)
}

type removeNodeTransform struct {
	target Node
}

func (t removeNodeTransform) apply(ctx *Context) {
	// TODO
}

type addAttrTransform struct {
	target     Node
	attributes Attr
}

func (t addAttrTransform) apply(ctx *Context) {
	// TODO
}

type updateAttrTransform struct {
	target     Node
	attributes Attr
}

func (t updateAttrTransform) apply(ctx *Context) {
	// TODO
}

type removeAttrTransform struct {
	target     Node
	attributes Attr
}

func (t removeAttrTransform) apply(ctx *Context) {
	// TODO
}

type updateTextTransform struct {
	target Node
	text   string
}

func (t updateTextTransform) apply(ctx *Context) {
	if tnode, ok := t.target.(*TextNode); ok {
		tnode.el.js.Set("data", t.text)
	}
}

type addListenerTransform struct {
	target  Node
	event   string
	handler EventHandler
}

func (t addListenerTransform) apply(ctx *Context) {
	// TODO
}

type removeListenerTransform struct {
	target  Node
	event   string
	handler EventHandler
}

func (t removeListenerTransform) apply(ctx *Context) {
	// TODO
}
