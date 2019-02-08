import RouteRecognizer from "route-recognizer";

export enum Page {
  Index = "INDEX",
  Share = "SHARE",
  View = "VIEW",
  NotFound = "NOTFOUND"
}

interface Route {
  page: Page;
  id?: string;
}

let router;
export function initRouter(path: string): Route {
  router = new RouteRecognizer();
  router.add([{ path: "/", handler: Page.Index }]);
  router.add([{ path: "/:id/share", handler: Page.Share }]);
  router.add([{ path: "/:id", handler: Page.View }]);
  const results = router.recognize(path);
  const notFound = {
    page: Page.NotFound
  };

  if (results === undefined) {
    return notFound;
  }

  const result = results[0];
  if (result === undefined) {
    return notFound;
  }

  return {
    page: result.handler as Page,
    id: result.params.id as string
  };
}
