import type { User } from "@/context/auth-context"

export function roleDestination(role: User["role"]): string {
  switch (role) {
    case "investor":
      return "/investor-dashboard"
    case "researcher":
      return "/researcher-dashboard"
    default:
      return "/"
  }
}
