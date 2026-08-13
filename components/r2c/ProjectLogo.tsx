import {
  Battery,
  Brain,
  Orbit,
  Shield,
  Sparkles,
  Wind,
  Zap,
} from "lucide-react"
import type { TrlProject } from "@/lib/trl-services/types"

export function ProjectLogo({
  logo,
  className = "h-4 w-4",
}: {
  logo: TrlProject["logo"]
  className?: string
}) {
  switch (logo || "composite") {
    case "battery":
      return <Battery className={`${className} text-amber-400`} />
    case "carbon":
      return <Zap className={`${className} text-teal-400`} />
    case "ai":
      return <Brain className={`${className} text-cyan-400`} />
    case "chitin":
      return <Sparkles className={`${className} text-emerald-400`} />
    case "shield":
      return <Shield className={`${className} text-purple-400`} />
    case "turbine":
      return <Wind className={`${className} text-orange-400`} />
    default:
      return <Orbit className={`${className} text-indigo-400`} />
  }
}
