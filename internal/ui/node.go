package ui

import "fmt"

// Node represents an element in the tree — HTML, Text, or Component.
type Node interface {
	Build(ctx *Context) Node
}

// MountableNode is a Node that can be mounted in the DOM.
type MountableNode interface {
	Node
	Mount(*Document, *Element, *Context) Node
}

// HTMLNode represents a DOM element.
type HTMLNode struct {
	attributes Attr
	children   []Node
	el         *Element
	listeners  Listeners
	tag        string
}

// Build returns HTMLNode pointer.
func (h *HTMLNode) Build(ctx *Context) Node { return h }

// Mount this HTMLNode in the DOM, and for caching purposes, non-mountable
// components are replaced with built results in children slice.
func (h *HTMLNode) Mount(document *Document, container *Element, ctx *Context) Node {
	h.el = document.CreateElement(h.tag, h.attributes, h.listeners)
	for i, child := range h.children {
		built := build(child, ctx)
		built.Mount(document, h.el, ctx)
		h.children[i] = built.(Node)
	}
	container.Append(h.el)
	return h
}

// NewHTMLNode creates a virtual dom node -- NewHTMLNode(tag, [attributes, events, ...children])
func NewHTMLNode(tag string, args ...interface{}) *HTMLNode {
	n := &HTMLNode{tag: tag}
	for _, arg := range args {
		switch val := arg.(type) {
		case Attr:
			n.attributes = val
		case Listeners:
			n.listeners = val
		case Node:
			n.children = append(n.children, val)
		case string:
			n.children = append(n.children, NewTextNode(val))
		}
	}
	return n
}

// TextNode represents text content in a DOM element.
type TextNode struct {
	text string
	el   *Element
}

// Build returns HTMLNode pointer.
func (t *TextNode) Build(ctx *Context) Node { return t }

// Mount this TextNode in the DOM
func (t *TextNode) Mount(document *Document, container *Element, ctx *Context) Node {
	t.el = document.CreateTextNode(t.text)
	container.Append(t.el)
	return t
}

// NewTextNode creates a text node.
func NewTextNode(str string) *TextNode {
	return &TextNode{text: str}
}

// build works recursively just in case a component returns a nested component.
func build(n Node, ctx *Context) MountableNode {
	built := n.Build(ctx)
	mn, isMountable := built.(MountableNode)
	if !isMountable {
		return build(built, ctx)
	}
	return mn
}

// TODO: update cache after collecting and applying transforms
func collectTransforms(curr Node, next Node, container *Element, ctx *Context) ([]transform, error) {
	nextBuild := build(next, ctx)
	transforms := []transform{}
	switch currNode := curr.(type) {
	case *HTMLNode:
		// If node type or tag changes, no other checks needed, tear down and add new node
		nextHTML, ok := nextBuild.(*HTMLNode)
		if !ok || currNode.tag != nextHTML.tag {
			fmt.Printf("NO MATCH! %T | %T\n", curr, nextBuild)
			transforms = append(
				transforms,
				removeNodeTransform{curr},
				addNodeTransform{target: nextBuild, parent: container})
			return transforms, nil
		}

		// Compare attributes (updating and clearing as needed)
		for k, v := range currNode.attributes {
			if val, ok := nextHTML.attributes[k]; !ok {
				removed := Attr{}
				removed[k] = v
				transforms = append(transforms, removeAttrTransform{
					target:     nextBuild,
					attributes: removed,
				})
			} else if val != v {
				changed := Attr{}
				changed[k] = val
				transforms = append(transforms, updateAttrTransform{
					target:     nextBuild,
					attributes: changed,
				})
			}
		}

		for k, v := range nextHTML.attributes {
			if _, ok := currNode.attributes[k]; !ok {
				added := Attr{}
				added[k] = v
				transforms = append(transforms, addAttrTransform{
					target:     nextBuild,
					attributes: added,
				})
			}
		}

		// Add or remove event listeners
		for k := range currNode.listeners {
			if val, ok := nextHTML.listeners[k]; !ok {
				transforms = append(transforms, removeListenerTransform{
					target:  nextBuild,
					event:   k,
					handler: val,
				})
			}
		}

		for k, v := range nextHTML.listeners {
			if _, ok := currNode.listeners[k]; !ok {
				transforms = append(transforms, addListenerTransform{
					target:  nextBuild,
					event:   k,
					handler: v,
				})
			}
		}

		// Update or remove children
		for i, child := range currNode.children {
			if len(nextHTML.children) > i {
				childXforms, err := collectTransforms(child, nextHTML.children[i], nextHTML.el, ctx)
				if err != nil {
					return nil, err
				}
				transforms = append(transforms, childXforms...)
			} else {
				transforms = append(transforms, removeNodeTransform{child})
			}
		}

		// Add new children
		if len(nextHTML.children) > len(currNode.children) {
			for _, nnChild := range nextHTML.children[len(currNode.children)-1:] {
				transforms = addNode(nnChild, nextHTML.el)
			}
		}

		nextHTML.el = currNode.el

	case *TextNode:
		// Check for node type change, then text change
		nextText, ok := nextBuild.(*TextNode)
		if !ok {
			transforms = append(
				transforms,
				removeNodeTransform{curr},
				addNodeTransform{target: nextBuild, parent: container})
			return transforms, nil
		}
		if currNode.text != nextText.text {
			transforms = append(transforms, updateTextTransform{
				target: nextBuild,
				text:   nextText.text,
			})
		}
		nextText.el = currNode.el
	}

	return transforms, nil
}

func addNode(n Node, container *Element) []transform {
	transforms := []transform{addNodeTransform{target: n, parent: container}}
	if html, ok := n.(*HTMLNode); ok && len(html.children) > 0 {
		for _, child := range html.children {
			childXforms := addNode(child, html.el)
			transforms = append(transforms, childXforms...)
		}
	}
	return transforms
}
