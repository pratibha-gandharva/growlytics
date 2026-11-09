import { useState, useMemo } from 'react'
import { useStudent } from '../../context/student-context'
import { Project } from '../../types'
import { ProjectCard } from './project-card'
import { ProjectModal } from './project-modal'
import { DeleteConfirmModal } from './delete-confirm-modal'
import { Button } from '../ui/button'
import { 
  Plus, 
  Search, 
  FolderGit2, 
  Info
} from 'lucide-react'

export function ProjectsView() {
  const { projects, addProject, updateProject, deleteProject, toggleMilestone } = useStudent()

  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null)

  const categories = ['All', 'Full-Stack', 'Frontend', 'Backend', 'AI/ML', 'Cloud/DevOps']

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.techStack.some((t) => t.toLowerCase().includes(query))
      return matchesCategory && matchesSearch
    })
  }, [projects, activeCategory, searchQuery])

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  const handleDeleteRequest = (projectId: string) => {
    setDeletingProjectId(projectId)
  }

  const handleConfirmDelete = () => {
    if (deletingProjectId) {
      deleteProject(deletingProjectId)
      setDeletingProjectId(null)
    }
  }

  const handleSaveProject = (projectData: any) => {
    if (editingProject) {
      updateProject({
        ...editingProject,
        ...projectData
      })
    } else {
      addProject(projectData)
    }
  }

  const deletingProjectTitle = projects.find((p) => p.id === deletingProjectId)?.title || 'Project'

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
              Project Garden
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              {projects.length} Artifacts
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Build your proof with live deployments, milestone roadmaps, and documented architecture.
          </p>
        </div>

        <Button
          variant="sprout"
          onClick={() => {
            setEditingProject(null)
            setIsModalOpen(true)
          }}
          className="gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Project
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                  : 'bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects or stack (e.g. React, Redis)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-input bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Demonstration Banner note */}
      <div className="p-3.5 rounded-xl bg-muted/50 border border-border/80 flex items-start gap-2.5 text-xs text-muted-foreground">
        <Info className="w-4 h-4 shrink-0 text-primary mt-0.5" />
        <p>
          <strong className="text-foreground">Demonstration Data:</strong> The pre-loaded projects represent sample engineering portfolios. You can freely edit them, check off milestones, delete them, or click <strong>Add Project</strong> to build your own personal portfolio.
        </p>
      </div>

      {/* Project Cards Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
              onToggleMilestone={toggleMilestone}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl border border-dashed border-border bg-card/50 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">No projects found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {searchQuery
              ? `No projects match "${searchQuery}". Try clearing filters or searching for another tech.`
              : `No projects in the "${activeCategory}" category yet. Add a new project to start tracking your proof!`}
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setActiveCategory('All')
              setSearchQuery('')
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Project Add/Edit Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        initialProject={editingProject}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingProjectId}
        onClose={() => setDeletingProjectId(null)}
        onConfirm={handleConfirmDelete}
        projectTitle={deletingProjectTitle}
      />
    </div>
  )
}
