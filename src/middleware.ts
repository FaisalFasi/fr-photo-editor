import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isProtectedRoute = createRouteMatcher(["/profile", "/settings"]);
// what does (.*) do?
// it matches any character (.) zero or more times (*) using the wildcard character (*) in regex syntax,
// so it will match /home, /home/1, /home/2, /home/3, etc.
// and /dashboard, /dashboard/1, /dashboard/2, /dashboard/3, etc.
const isProtectedRoute = createRouteMatcher(["/profile", "/settings"]);
const isPublicRoute = createRouteMatcher([
  "/",
  "/api/webhooks/clerk",
  "/api/webhooks/stripe",
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) {
    return;
  }
  // if (isProtectedRoute(req)) auth().protect();

  if (!auth().userId && isProtectedRoute(req)) {
    return auth().redirectToSignIn();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
