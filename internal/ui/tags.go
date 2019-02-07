package ui

// Div creates <div> html element.
func Div(args ...interface{}) *HTMLNode {
	return NewHTMLNode("div", args...)
}

// Section creates <section> html element.
func Section(args ...interface{}) *HTMLNode {
	return NewHTMLNode("section", args...)
}

// Header creates <header> html element.
func Header(args ...interface{}) *HTMLNode {
	return NewHTMLNode("header", args...)
}

// H1 creates <h1> html element.
func H1(args ...interface{}) *HTMLNode {
	return NewHTMLNode("h1", args...)
}

// H2 creates <h2> html element.
func H2(args ...interface{}) *HTMLNode {
	return NewHTMLNode("h2", args...)
}

// H3 creates <h3> html element.
func H3(args ...interface{}) *HTMLNode {
	return NewHTMLNode("h3", args...)
}

// P creates <p> html element.
func P(args ...interface{}) *HTMLNode {
	return NewHTMLNode("p", args...)
}

// Table creates <table> html element.
func Table(args ...interface{}) *HTMLNode {
	return NewHTMLNode("table", args...)
}

// Tr creates <tr> html element.
func Tr(args ...interface{}) *HTMLNode {
	return NewHTMLNode("tr", args...)
}

// Td creates <td> html element.
func Td(args ...interface{}) *HTMLNode {
	return NewHTMLNode("td", args...)
}

// Input creates <td> html element.
func Input(args ...interface{}) *HTMLNode {
	return NewHTMLNode("input", args...)
}

var selfClosingTags = [17]string{
	"area",
	"base",
	"br",
	"col",
	"command",
	"embed",
	"hr",
	"img",
	"input",
	"keygen",
	"link",
	"menuitem",
	"meta",
	"param",
	"source",
	"track",
	"wbr",
}

func isSelfClosing(tag string) bool {
	for _, v := range selfClosingTags {
		if v == tag {
			return true
		}
	}
	return false
}
