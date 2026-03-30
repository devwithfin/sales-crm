/* eslint-disable */
import { lazy, type LazyExoticComponent } from "react"

type GeneratedRoute = {
    path: string
    Component: LazyExoticComponent<() => JSX.Element>
}

export const genMenuRoutes: GeneratedRoute[] = [
  {
    path: "/dashboard",
    Component: lazy(() => import("@/pages/generated/dashboard")),
  },
  {
    path: "/leads",
    Component: lazy(() => import("@/pages/generated/leads")),
  },
  {
    path: "/products",
    Component: lazy(() => import("@/pages/generated/products")),
  },
  {
    path: "/menus",
    Component: lazy(() => import("@/pages/generated/menus")),
  },
  {
    path: "/category-product",
    Component: lazy(() => import("@/pages/generated/category-product")),
  },
  {
    path: "/reports",
    Component: lazy(() => import("@/pages/generated/reports")),
  },
  {
    path: "/contacts",
    Component: lazy(() => import("@/pages/generated/contacts")),
  },
  {
    path: "/quotes",
    Component: lazy(() => import("@/pages/generated/quotes")),
  },
  {
    path: "/permissions",
    Component: lazy(() => import("@/pages/generated/permissions")),
  },
  {
    path: "/accounts",
    Component: lazy(() => import("@/pages/generated/accounts")),
  },
  {
    path: "/purchase-orders",
    Component: lazy(() => import("@/pages/generated/purchase-orders")),
  },
  {
    path: "/roles",
    Component: lazy(() => import("@/pages/generated/roles")),
  },
  {
    path: "/deals",
    Component: lazy(() => import("@/pages/generated/deals")),
  },
  {
    path: "/users",
    Component: lazy(() => import("@/pages/generated/users")),
  },
  {
    path: "/visits",
    Component: lazy(() => import("@/pages/generated/visits")),
  }
]
