/** plain { pathname, search, hash } copy of a router location (safe to keep in history state) */
export const toPath = (loc) => (loc ? { pathname: loc.pathname, search: loc.search ?? "", hash: loc.hash ?? "" } : "/");

/* The last page the visitor was looking at. If they open a members-only page
   (e.g. My Library) while logged out, the login box opens on top of this page. */
let lastPage = null;
export const setLastPage = (loc) => {
  lastPage = toPath(loc);
};
export const getLastPage = () => lastPage ?? toPath({ pathname: "/" });