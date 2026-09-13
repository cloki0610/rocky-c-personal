import type {} from "react/experimental";

// React 19.3 exports the stable name; the installed types still use the old name.
declare module "react" {
  export const ViewTransition: typeof unstable_ViewTransition;
}
