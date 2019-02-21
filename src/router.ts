import RouteRecognizer from "route-recognizer";

export enum Page {
  Write = "WRITE",
  Share = "SHARE",
  View = "VIEW",
  NotFound = "NOTFOUND"
}

interface Route {
  page: Page;
  id?: string;
}

export class Router {
  private matcher: RouteRecognizer;

  constructor() {
    this.matcher = new RouteRecognizer();
    this.matcher.add([{ path: "/", handler: Page.Write }]);
    this.matcher.add([{ path: "/:id/share", handler: Page.Share }]);
    this.matcher.add([{ path: "/:id", handler: Page.View }]);
  }

  match(path: string): Route {
    const results = this.matcher.recognize(path);
    if (results == null) {
      return { page: Page.NotFound };
    }
    const result = results[0];
    if (result == null) {
      return { page: Page.NotFound };
    }
    // TODO: handler needs to fetch data (if no data, return 404 notFound)
    // TODO: also need a way to return status code
    return {
      page: result.handler as Page,
      id: result.params.id as string
    };
  }
}
