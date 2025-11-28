import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/webhooks/clerk",
    "/api/webhooks/stripe",
    "/sign-in(.*)",
    "/sign-up(.*)",
    // Make all transformation routes public so auth() can be called
    // Individual pages will handle their own authentication checks
    "/transformations(.*)",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
