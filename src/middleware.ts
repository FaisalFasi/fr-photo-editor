import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/",
  "/profile",
  "/settings",
  "/home(.*)",
  "/dashboard(.*)",
  "/forum(.*)",

  // what does (.*) do?
  // it matches any character (.) zero or more times (*) using the wildcard character (*) in regex syntax,
  // so it will match /home, /home/1, /home/2, /home/3, etc.
  // and /dashboard, /dashboard/1, /dashboard/2, /dashboard/3, etc.
]);
// const isPublicRoute = createRouteMatcher(["/api/webhooks/clerk"]);

export default clerkMiddleware((auth, req) => {
  if (!auth().userId && isProtectedRoute(req)) {
    // Add custom logic to run before redirecting

    return auth().redirectToSignIn();
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
