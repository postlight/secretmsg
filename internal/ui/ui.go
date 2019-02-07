package ui

import (
	"fmt"
	"strings"
	"syscall/js"
	"time"
)

// Start creates a DOM element tree and appends it to the DOM then starts an
// event loop to handle updates after state changes.
func Start(root Node, container *Element, ctx *Context) error {
	document := GetDocument()
	built := build(root, ctx)
	ctx.currTree = built.Mount(document, container, ctx)
	draw(root, container, ctx)
	return nil
}

// String renders html string representation of node tree.
func String(n Node, ctx *Context) string {
	var builder strings.Builder
	switch node := build(n, ctx).(type) {
	case *HTMLNode:
		// Opening tag and attributes
		builder.WriteString(fmt.Sprint("<", node.tag))
		for k, v := range node.attributes {
			builder.WriteString(fmt.Sprintf(" %s=\"%s\"", k, v))
		}
		builder.WriteString(">")

		// Children
		for _, child := range node.children {
			builder.WriteString(String(child, ctx))
		}

		// Closing tag (if not self-closing)
		if !isSelfClosing(node.tag) {
			builder.WriteString(fmt.Sprint("</", node.tag, ">"))
		}

	case *TextNode:
		builder.WriteString(node.text)
	}

	return builder.String()
}

func draw(root Node, container *Element, ctx *Context) {
	if ctx.needsUpdate {
		ctx.needsUpdate = false
		go applyUpdate(root, container, ctx)
	}
	RequestFrame(func(args []js.Value) {
		draw(root, container, ctx)
	})
}

func applyUpdate(root Node, container *Element, ctx *Context) {
	nextRoot := build(root, ctx)
	xforms, err := collectTransforms(ctx.currTree, nextRoot, container, ctx)
	if err != nil {
		fmt.Println("Problem in node comparison:", err)
	}

	start := time.Now()
	for _, transform := range xforms {
		fmt.Printf("Transform: %T - %+v\n", transform, transform)
		transform.apply(ctx)
	}
	fmt.Println("Tranformed:", time.Since(start))
}
