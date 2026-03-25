/* eslint-disable */
import { lazy, type LazyExoticComponent } from "react"

type GeneratedRoute = {
    path: string
    Component: LazyExoticComponent<() => JSX.Element>
}

export const generatedMenuRoutes: GeneratedRoute[] = [
  {
    path: "/dashboard",
    Component: lazy(() => import("@/pages/generated/dashboard/index")),
  },
  {
    path: "/leads",
    Component: lazy(() => import("@/pages/generated/leads/index")),
  },
  {
    path: "/products",
    Component: lazy(() => import("@/pages/generated/products/index")),
  },
  {
    path: "/menus",
    Component: lazy(() => import("@/pages/generated/menus/index")),
  },
  {
    path: "/reports",
    Component: lazy(() => import("@/pages/generated/reports/index")),
  },
  {
    path: "/contacts",
    Component: lazy(() => import("@/pages/generated/contacts/index")),
  },
  {
    path: "/quotes",
    Component: lazy(() => import("@/pages/generated/quotes/index")),
  },
  {
    path: "/permissions",
    Component: lazy(() => import("@/pages/generated/permissions/index")),
  },
  {
    path: "/accounts",
    Component: lazy(() => import("@/pages/generated/accounts/index")),
  },
  {
    path: "/purchase-orders",
    Component: lazy(() => import("@/pages/generated/purchase-orders/index")),
  },
  {
    path: "/roles",
    Component: lazy(() => import("@/pages/generated/roles/index")),
  },
  {
    path: "/deals",
    Component: lazy(() => import("@/pages/generated/deals/index")),
  },
  {
    path: "/users",
    Component: lazy(() => import("@/pages/generated/users/index")),
  },
  {
    path: "/visits",
    Component: lazy(() => import("@/pages/generated/visits/index")),
  }
]
