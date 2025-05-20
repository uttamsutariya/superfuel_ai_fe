import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"), route("/snippets/:snippetId", "routes/snippet.tsx")] satisfies RouteConfig;
