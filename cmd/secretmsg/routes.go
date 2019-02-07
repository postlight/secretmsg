package main

import (
	"net/url"
	"strings"
)

const (
	notFound = iota
	index
	view
	share
)

func route(href string) (page int, id string) {
	u, err := url.Parse(href)
	if err != nil {
		return notFound, ""
	}
	segments := strings.Split(strings.Trim(u.Path, "/"), "/")
	if segments[0] == "" {
		// ""
		return index, ""
	} else if len(segments) == 1 {
		// "/:hash"
		return view, segments[0]
	} else if len(segments) == 2 && segments[1] == "share" {
		// "/:hash/share"
		return share, segments[0]
	}
	return notFound, ""
}
