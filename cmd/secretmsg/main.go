package main

import (
	"fmt"
	"syscall/js"
	"time"

	"github.com/postlight/secretmsg/internal/ui"
)

func main() {
	block := make(chan bool)
	ui.ExposeMethod("SecretMsg", "run", run)
	ui.ExposeMethod("SecretMsg", "htmlString", htmlString)
	<-block
}

// starts the app client-side, no args expected
func run(args []js.Value) {
	start := time.Now()
	page, id := route(ui.GetLocation())
	body := ui.GetDocument().Body()
	ctx := ui.NewContext()
	ctx.Set("page", page)
	ctx.Set("id", id)
	app := &root{}
	err := ui.Start(app, body, ctx)
	if err != nil {
		fmt.Println("MOUNT ERROR:", err)
	}
	fmt.Println("MOUNTED:", time.Since(start))
}

// htmlString expects two arguments (url string, callback func(string))
func htmlString(args []js.Value) {
	start := time.Now()
	url := args[0].String()
	callback := args[1]
	page, id := route(url)
	ctx := ui.NewContext()
	ctx.Set("page", page)
	ctx.Set("id", id)
	app := &root{}
	output := ui.String(app, ctx)
	fmt.Println("String:", time.Since(start))
	fmt.Println(output)
	callback.Invoke(output)
}
