"use client"

import { useState } from "react"
import { Award, Atom, Battery, Flame, Leaf, Microscope, Sparkles, Wind, Zap, Droplets, Cpu, Globe, Beaker } from "lucide-react"

// Project data from Project page - maintaining TRL consistency
const ecosystemProjects = [
  {
    id: "000001",
    title: "CNT Power Cable",
    trl: 5,
    score: 82,
    description: "Carbon nanotube-based power cables with enhanced conductivity for energy transmission applications. Currently in validation phase.",
    image: "https://6ibpna7m8edwyvzk.public.blob.vercel-storage.com/24225-cinta-black.webp",
    researcher: "Dr. Sarah Chen",
    institution: "MIT",
    category: "Equity",
    phase: "Validation",
    fundingRaised: 95000,
    fundingGoal: 150000,
  },
  {
    id: "000002",
    title: "MOF Water Harvesting",
    trl: 4,
    score: 79,
    description: "Metal-organic framework membranes for atmospheric water harvesting. Lab testing phase with promising results.",
    image: "https://6ibpna7m8edwyvzk.public.blob.vercel-storage.com/0_5nmrfh2KtQ5KjByN.png",
    researcher: "Prof. James Okafor",
    institution: "Stanford",
    category: "Initiative",
    phase: "Lab Testing",
    fundingRaised: 45000,
    fundingGoal: 80000,
  },
  {
    id: "000003",
    title: "Aluminum-Air Battery",
    trl: 3,
    score: 76,
    description: "High-energy density aluminum-air battery technology for grid storage. Proof of concept demonstrated.",
    image: "https://6ibpna7m8edwyvzk.public.blob.vercel-storage.com/Aluminum-Air-Experimental-Power-Cell.jpg",
    researcher: "Dr. Mei Lin",
    institution: "Tsinghua",
    category: "Equity",
    phase: "Proof of Concept",
    fundingRaised: 5000,
    fundingGoal: 25000,
  },
  {
    id: "000004",
    title: "G-Cap 500",
    trl: 6,
    score: 85,
    description: "Advanced graphene-based supercapacitor technology for rapid energy storage and discharge. Scale-up phase.",
    image: "https://6ibpna7m8edwyvzk.public.blob.vercel-storage.com/ImageForArticle_6053_16478598102957979.webp",
    researcher: "Prof. Dr. Arnon Jenkins",
    institution: "MIT",
    category: "Equity",
    phase: "Scale-Up",
    fundingRaised: 180000,
    fundingGoal: 250000,
  },
  {
    id: "000005",
    title: "Cassava-Bioplast",
    trl: 4,
    score: 80,
    description: "Biodegradable plastics derived from cassava starch for sustainable packaging applications.",
    image: "https://6ibpna7m8edwyvzk.public.blob.vercel-storage.com/bot_san_day_0_bc14fddbd3.jpg",
    researcher: "Dr. Amina Bello",
    institution: "U. Lagos",
    category: "Initiative",
    phase: "Lab Testing",
    fundingRaised: 80000,
    fundingGoal: 120000,
  },
  {
    id: "000006",
    title: "Perovskite Solar Film",
    trl: 5,
    score: 83,
    description: "Flexible perovskite solar cell films for building-integrated photovoltaics. Validation phase.",
    image: "https://6ibpna7m8edwyvzk.public.blob.vercel-storage.com/Solliance-perovskite-solar-cell.jpg",
    researcher: "Dr. Ravi Patel",
    institution: "Oxford",
    category: "Equity",
    phase: "Validation",
    fundingRaised: 134000,
    fundingGoal: 200000,
  },
  {
    id: "000007",
    title: "Graphene Nano-Filter",
    trl: 3,
    score: 77,
    description: "Graphene-based nanofiltration membranes for water purification and desalination.",
    image: "https://6ibpna7m8edwyvzk.public.blob.vercel-storage.com/f0367148-800px-wm.jpg",
    researcher: "Dr. Lena Svenson",
    institution: "KTH Stockholm",
    category: "Initiative",
    phase: "Proof of Concept",
    fundingRaised: 22000,
    fundingGoal: 60000,
  },
  {
    id: "000008",
    title: "Mycelium Composite",
    trl: 4,
    score: 78,
    description: "Mycelium-based composite materials for sustainable construction and packaging.",
    image: "https://6ibpna7m8edwyvzk.public.blob.vercel-storage.com/image.imageformat.930.1580458024.jpg",
    researcher: "Dr. Kai Tanaka",
    institution: "U. Tokyo",
    category: "Equity",
    phase: "Lab Testing",
    fundingRaised: 41000,
    fundingGoal: 90000,
  },
]

export default function OurEcosystemPage() {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)

  const topProjects = ecosystemProjects.filter((p) => p.trl >= 6)
  const middleProjects = ecosystemProjects.filter((p) => p.trl >= 4 && p.trl <= 5)
  const bottomProjects = ecosystemProjects.filter((p) => p.trl >= 3 && p.trl <= 3)

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
          {/* Top Tier - TRL 6+ */}
          {topProjects.length > 0 && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-[#6efcff]/20 px-3 py-1 text-[10px] font-semibold text-[#c5fdff]">
                  TRL 6+
                </span>
                <span className="text-xs text-white/50">Development & Scale-Up</span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {topProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} hoveredProject={hoveredProject} setHoveredProject={setHoveredProject} />
                ))}
              </div>
            </div>
          )}

          {/* Middle Tier - TRL 4-5 */}
          {middleProjects.length > 0 && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-[#34d399]/20 px-3 py-1 text-[10px] font-semibold text-[#34d399]">
                  TRL 4-5
                </span>
                <span className="text-xs text-white/50">Lab Testing & Validation</span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {middleProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} hoveredProject={hoveredProject} setHoveredProject={setHoveredProject} />
                ))}
              </div>
            </div>
          )}

          {/* Bottom Tier - TRL 3 */}
          {bottomProjects.length > 0 && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-[#f59e0b]/20 px-3 py-1 text-[10px] font-semibold text-[#f59e0b]">
                  TRL 3
                </span>
                <span className="text-xs text-white/50">Proof of Concept</span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {bottomProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} hoveredProject={hoveredProject} setHoveredProject={setHoveredProject} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/3 px-6 py-5 text-center">
          <p className="text-xs text-white/50">
            Projects sourced from the Project marketplace. TRL levels are synchronized across the platform for consistency.
          </p>
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project, hoveredProject, setHoveredProject }: { project: typeof ecosystemProjects[0]; hoveredProject: string | null; setHoveredProject: (id: string | null) => void }) {
  return (
    <div
      className="group workflow-panel relative rounded-2xl overflow-hidden transition-all hover:-translate-y-1"
      onMouseEnter={() => setHoveredProject(project.id)}
      onMouseLeave={() => setHoveredProject(null)}
    >
      <div className="aspect-square w-full overflow-hidden bg-black/40">
        <img 
          src={project.image} 
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="mb-2 flex gap-2">
          <span className="rounded-full border border-[#6efcff]/30 bg-[#6efcff]/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-[#c5fdff]">
            TRL {project.trl}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] text-white/60">
            {project.score}
          </span>
        </div>
        <h3 className="font-headline mb-1 text-sm font-bold text-white/95 leading-tight">{project.title}</h3>
        <p className="text-[10px] text-white/40">{project.researcher} · {project.institution}</p>
      </div>
      
      {hoveredProject === project.id && (
        <div className="absolute inset-x-0 bottom-0 rounded-b-2xl border-t border-white/10 bg-black/95 p-4 backdrop-blur-sm transition-all">
          <p className="mb-2 text-[10px] leading-relaxed text-white/70">{project.description}</p>
          <div className="flex items-center justify-between text-[9px] text-white/50">
            <span>${(project.fundingRaised / 1000).toFixed(0)}K raised</span>
            <span>{project.phase}</span>
          </div>
        </div>
      )}
    </div>
  )
}
