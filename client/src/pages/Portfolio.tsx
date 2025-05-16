import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import Layout from "@/components/Layout";
import ProjectCard from "@/components/ProjectCard";
import ProjectTimeline from "@/components/ProjectTimeline";
import AddProjectButton from "@/components/AddProjectButton";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter, LayoutGrid, List, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { type Project } from "@shared/schema";

export default function Portfolio() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [viewMode, setViewMode] = useState<"cards" | "timeline">("cards");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [year, setYear] = useState<string>("");
  const { toast } = useToast();
  
  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    navigate("/");
    return null;
  }

  // Fetch projects
  const { data: projects, isLoading, isError } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: isAuthenticated,
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
      return id;
    },
    onSuccess: () => {
      toast({
        title: "Project deleted",
        description: "Your project has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setShowDeleteDialog(false);
      setProjectToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete project: ${error}`,
        variant: "destructive",
      });
    },
  });

  // Handle edit project
  const handleEditProject = (id: number) => {
    navigate(`/edit-project/${id}`);
  };

  // Handle delete project
  const handleDeleteProject = (id: number) => {
    setProjectToDelete(id);
    setShowDeleteDialog(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (projectToDelete) {
      deleteProjectMutation.mutate(projectToDelete);
    }
  };

  // Handle share profile
  const handleShareProfile = () => {
    if (user?.username) {
      const profileUrl = `${window.location.origin}/${user.username}`;
      navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Link copied",
        description: "Your profile link has been copied to clipboard",
      });
    } else {
      toast({
        title: "Username not set",
        description: "Please set a username in your profile settings first",
        variant: "destructive",
      });
    }
  };

  // Filter projects
  const filteredProjects = projects
    ? projects.filter((project) => {
        // Search filter
        const matchesSearch = !searchQuery || 
          project.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.hackathonName.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Year filter
        const matchesYear = !year || 
          new Date(project.date).getFullYear().toString() === year;
        
        return matchesSearch && matchesYear;
      })
    : [];

  // Get available years for filter
  const availableYears = projects
    ? [...new Set(projects.map(p => new Date(p.date).getFullYear().toString()))]
        .sort((a, b) => parseInt(b) - parseInt(a))
    : [];

  return (
    <Layout 
      title="My Portfolio" 
      showShareButton={!!user?.username}
      onShareClick={handleShareProfile}
    >
      {/* Portfolio Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-end justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">My Hackathon Portfolio</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-300">Showcasing my projects and hackathon experiences</p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-4 py-2 w-full sm:w-[200px] md:w-[250px]"
              />
            </div>
            
            {/* Year filter */}
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[140px] flex items-center">
                <Filter className="h-4 w-4 mr-1.5" />
                <SelectValue placeholder="Filter by year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All years</SelectItem>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* View toggle */}
            <div className="hidden sm:flex items-center space-x-1 px-2 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setViewMode("cards")}
                className={viewMode === "cards" 
                  ? "text-primary-600 dark:text-primary-400" 
                  : "text-gray-500 dark:text-gray-400"
                }
              >
                <LayoutGrid className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setViewMode("timeline")}
                className={viewMode === "timeline" 
                  ? "text-primary-600 dark:text-primary-400" 
                  : "text-gray-500 dark:text-gray-400"
                }
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md">
                <Skeleton className="w-full h-48" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-20 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute top-0 bottom-0 left-[19px] w-0.5 bg-gray-200 dark:bg-gray-700 z-0"></div>
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="mb-10 ml-10 relative">
                <div className="absolute -left-10 mt-1 w-6 h-6 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center z-10"></div>
                <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md p-5 space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-20 w-full" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Error state */}
      {isError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">
            Failed to load projects. Please try again later.
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && filteredProjects.length === 0 && (
        <div className="text-center py-16 px-4">
          {projects?.length === 0 ? (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <PlusCircle className="h-8 w-8 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No projects yet</h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-6">
                Start adding your hackathon projects to build your portfolio.
              </p>
              <Button 
                variant="primary" 
                onClick={() => navigate("/add-project")}
                className="text-white"
              >
                Add Your First Project
              </Button>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <Search className="h-8 w-8 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No matching projects</h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-6">
                No projects match your search criteria. Try adjusting your filters.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setYear("");
                }}
              >
                Clear Filters
              </Button>
            </>
          )}
        </div>
      )}

      {/* Cards View */}
      {!isLoading && !isError && filteredProjects.length > 0 && viewMode === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}

      {/* Timeline View */}
      {!isLoading && !isError && filteredProjects.length > 0 && viewMode === "timeline" && (
        <ProjectTimeline
          projects={filteredProjects}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
        />
      )}

      {/* Add New Project Button */}
      <AddProjectButton />

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleteProjectMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteProjectMutation.isPending}
            >
              {deleteProjectMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

// Helper icon component for empty state
function PlusCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}
