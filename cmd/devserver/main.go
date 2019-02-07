package main

import (
	"flag"
	"log"
	"net/http"
	"path"
)

var (
	listen = flag.String("listen", ":8888", "listen address")
	dir    = flag.String("dir", ".", "directory to serve")
)

func main() {
	flag.Parse()
	http.Handle("/assets/", http.FileServer(http.Dir(*dir)))
	http.HandleFunc("/", indexHandler)
	log.Printf("listening on http://localhost%s", *listen)
	log.Fatal(http.ListenAndServe(*listen, nil))
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, path.Join(*dir, "index.html"))
}
