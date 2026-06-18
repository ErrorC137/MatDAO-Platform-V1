"use client"

import { useState } from "react"
import { Award, Atom, Battery, Flame, Leaf, Microscope, Sparkles, Wind, Zap, Droplets, Cpu, Globe } from "lucide-react"

const dummyProjects = [
  // TRL 8-9 (Top - 4 projects)
  {
    id: 1,
    title: "Solid-State Battery Electrolytes",
    trl: 9,
    score: 95,
    description: "Next-generation solid-state electrolytes with 10x higher ionic conductivity for electric vehicle applications. Commercial production ready.",
    icon: Battery,
    color: "#6efcff",
  },
  {
    id: 2,
    title: "Biodegradable Polymers",
    trl: 8,
    score: 92,
    description: "Marine-degradable bioplastics from agricultural waste with industrial-scale production ready. Full commercial deployment.",
    icon: Leaf,
    color: "#34d399",
  },
  {
    id: 3,
    title: "Advanced Carbon Capture",
    trl: 8,
    score: 91,
    description: "Direct air capture systems with 50% lower energy consumption. Commercial plants operational in 3 regions.",
    icon: Wind,
    color: "#a78bfa",
  },
  {
    id: 4,
    title: "Quantum Computing Materials",
    trl: 9,
    score: 94,
    description: "Room-temperature superconducting materials for quantum computing applications. Patented and licensed.",
    icon: Atom,
    color: "#f472b6",
  },
  // TRL 6-7 (Middle - 6 projects)
  {
    id: 5,
    title: "AI-Designed Catalysts",
    trl: 7,
    score: 88,
    description: "Machine learning-optimized catalysts for green hydrogen production with 3x efficiency gains. Pilot testing complete.",
    icon: Sparkles,
    color: "#f59e0b",
  },
  {
    id: 6,
    title: "Thermal Energy Storage",
    trl: 6,
    score: 86,
    description: "Phase-change materials for grid-scale thermal energy storage with 24-hour discharge capability. Demo plant running.",
    icon: Flame,
    color: "#fb923c",
  },
  {
    id: 7,
    title: "Nanocomposite Coatings",
    trl: 7,
    score: 89,
    description: "Self-healing nanocomposite coatings for aerospace applications with extreme temperature resistance. Flight testing.",
    icon: Microscope,
    color: "#60a5fa",
  },
  {
    id: 8,
    title: "Smart Grid Materials",
    trl: 6,
    score: 85,
    description: "Conductive polymers for smart grid infrastructure. Field trials in progress with utility partners.",
    icon: Zap,
    color: "#fbbf24",
  },
  {
    id: 9,
    title: "Water Purification Membranes",
    trl: 7,
    score: 87,
    description: "Graphene oxide membranes for desalination with 99.9% rejection rate. Pilot deployment in 2 municipalities.",
    icon: Droplets,
    color: "#38bdf8",
  },
  {
    id: 10,
    title: "Biomedical Sensors",
    trl: 6,
    score: 84,
    description: "Flexible biosensors for continuous health monitoring. Clinical trials underway.",
    icon: Cpu,
    color: "#a78bfa",
  },
  // TRL 3-5 (Bottom - 10 projects)
  {
    id: 11,
    title: "Smart Concrete",
    trl: 5,
    score: 82,
    description: "Self-sensing concrete with embedded nanomaterials for real-time structural health monitoring. Lab validation complete.",
    icon: Award,
    color: "#a78bfa",
  },
  {
    id: 12,
    title: "Perovskite Solar Cells",
    trl: 4,
    score: 80,
    description: "Stable perovskite solar cells with 25% efficiency. Stability testing in progress.",
    icon: Atom,
    color: "#f472b6",
  },
  {
    id: 13,
    title: "Hydrogen Storage Alloys",
    trl: 5,
    score: 81,
    description: "Metal hydride alloys for solid-state hydrogen storage. Prototype testing successful.",
    icon: Battery,
    color: "#6efcff",
  },
  {
    id: 14,
    title: "Bio-based Adhesives",
    trl: 4,
    score: 79,
    description: "Sustainable adhesives from lignin for construction applications. Scale-up feasibility study.",
    icon: Leaf,
    color: "#34d399",
  },
  {
    id: 15,
    title: "Carbon Fiber Recycling",
    trl: 5,
    score: 83,
    description: "Chemical recycling process for end-of-life carbon fiber composites. Pilot plant construction.",
    icon: Flame,
    color: "#fb923c",
  },
  {
    id: 16,
    title: "Thermoelectric Materials",
    trl: 4,
    score: 78,
    description: "High-efficiency thermoelectric materials for waste heat recovery. Material optimization phase.",
    icon: Sparkles,
    color: "#f59e0b",
  },
  {
    id: 17,
    title: "Self-healing Polymers",
    trl: 3,
    score: 76,
    description: "Autonomous self-healing polymer systems for infrastructure. Proof-of-concept demonstrated.",
    icon: Microscope,
    color: "#60a5fa",
  },
  {
    id: 18,
    title: "Sustainable Insulation",
    trl: 4,
    score: 80,
    description: "Cellulose-based insulation materials with superior thermal properties. Lab-scale production.",
    icon: Wind,
    color: "#a78bfa",
  },
  {
    id: 19,
    title: "Ocean Plastic Upcycling",
    trl: 5,
    score: 82,
    description: "Chemical upcycling of ocean plastics into value-added materials. Process validation complete.",
    icon: Globe,
    color: "#38bdf8",
  },
  {
    id: 20,
    title: "Magnetic Cooling Materials",
    trl: 3,
    score: 77,
    description: "Magnetocaloric materials for solid-state cooling. Fundamental research phase.",
    icon: Zap,
    color: "#fbbf24",
  },
]

export default function OurEcosystemPage() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)

  const topProjects = dummyProjects.filter((p) => p.trl >= 8)
  const middleProjects = dummyProjects.filter((p) => p.trl >= 6 && p.trl <= 7)
  const bottomProjects = dummyProjects.filter((p) => p.trl >= 3 && p.trl <= 5)

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] px-5 py-12 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/16 via-black/26 to-black/56" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#6efcff]/35 bg-[#6efcff]/10 px-4 py-1 text-[11px] uppercase tracking-[0.18em] text-[#c5fdff]">
            <Award className="h-3.5 w-3.5" />
            Our Ecosystem
          </p>
          <h1 className="font-headline mb-2 text-3xl font-extrabold text-white/95 md:text-4xl">
            Research-to-Commercialization Projects
          </h1>
          <p className="max-w-2xl text-sm text-white/60">
            Explore cutting-edge material science projects organized by TRL stage. Projects progress from early research
            (TRL 3-5) through development (TRL 6-7) to commercial deployment (TRL 8-9). Hover over projects to learn more.
          </p>
        </div>

        {/* Pyramid Structure */}
        <div className="space-y-6">
          {/* Top Tier - TRL 8-9 */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-[#6efcff]/20 px-3 py-1 text-[10px] font-semibold text-[#c5fdff]">
                TRL 8-9
              </span>
              <span className="text-xs text-white/50">Commercial Deployment</span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {topProjects.map((project) => (
                <ProjectCard key={project.id} project={project} hoveredProject={hoveredProject} setHoveredProject={setHoveredProject} />
              ))}
            </div>
          </div>

          {/* Middle Tier - TRL 6-7 */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-[#34d399]/20 px-3 py-1 text-[10px] font-semibold text-[#34d399]">
                TRL 6-7
              </span>
              <span className="text-xs text-white/50">Development & Pilot</span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {middleProjects.map((project) => (
                <ProjectCard key={project.id} project={project} hoveredProject={hoveredProject} setHoveredProject={setHoveredProject} />
              ))}
            </div>
          </div>

          {/* Bottom Tier - TRL 3-5 */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-[#f59e0b]/20 px-3 py-1 text-[10px] font-semibold text-[#f59e0b]">
                TRL 3-5
              </span>
              <span className="text-xs text-white/50">Early Research & Validation</span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {bottomProjects.map((project) => (
                <ProjectCard key={project.id} project={project} hoveredProject={hoveredProject} setHoveredProject={setHoveredProject} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/3 px-6 py-5 text-center">
          <p className="text-xs text-white/50">
            These are representative projects showcasing the types of material science innovations tracked on the MatDAO
            platform. Real project data will be populated from the backend.
          </p>
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project, hoveredProject, setHoveredProject }: { project: typeof dummyProjects[0]; hoveredProject: number | null; setHoveredProject: (id: number | null) => void }) {
  const Icon = project.icon
  return (
    <div
      className="group workflow-panel relative rounded-2xl p-5 transition-all hover:-translate-y-1"
      onMouseEnter={() => setHoveredProject(project.id)}
      onMouseLeave={() => setHoveredProject(null)}
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black/40">
        <Icon className="h-6 w-6" style={{ color: project.color }} />
      </div>
      <div className="mb-2 flex gap-2">
        <span
          className="rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-wider text-white/60"
          style={{ borderColor: `${project.color}40`, color: project.color }}
        >
          TRL {project.trl}
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] text-white/60">
          {project.score}
        </span>
      </div>
      <h3 className="font-headline mb-1 text-sm font-bold text-white/95 leading-tight">{project.title}</h3>
      
      {hoveredProject === project.id && (
        <div className="absolute inset-x-0 bottom-0 rounded-b-2xl border-t border-white/10 bg-black/95 p-3 backdrop-blur-sm transition-all">
          <p className="text-[10px] leading-relaxed text-white/70">{project.description}</p>
        </div>
      )}
    </div>
  )
}
