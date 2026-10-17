/**
 * Cloudflare Access (the Library's only sign-in layer).
 *
 * Sign-out is Access's own, officially documented endpoint on the application's hostname: `<application-domain>/cdn-cgi/access/logout`
 * (Cloudflare Zero Trust, "Session management"). Access handles the path itself, before any Library file is served. It clears the
 * application's authorisation cookie and revokes the user's Access session across ALL applications protected by the same Access login; end users
 * cannot sign out of a single application, and previously issued tokens stop being accepted within about 20 to 30 seconds.
 *
 * A relative path is used so the link follows whichever hostname the Library is served from; no team name or identity is stored in the repository.
 * The Library never simulates a sign-out in the browser and never clears the member's local data when signing out.
 */
export const ACCESS_LOGOUT_PATH = "/cdn-cgi/access/logout";
