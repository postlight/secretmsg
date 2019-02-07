package main

import "github.com/postlight/secretmsg/internal/ui"

type root struct{}

func (a *root) Build(ctx *ui.Context) ui.Node {
	page, found := ctx.Get("page")
	if !found {
		return ui.Div("No route.")
	}
	switch page {
	case index:
		return ui.Div("Write message here...")
	case share:
		return ui.Div("Share message here...")
	case view:
		return ui.Div("View message here...")
	default:
		return ui.Div("404 :(")
	}

}
