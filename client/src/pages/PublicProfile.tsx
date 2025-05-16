import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import Layout from "@/components/Layout";
import ProjectCard from "@/components/ProjectCard";
import ProjectTimeline from "@/components/ProjectTimeline";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutGrid, List, Filter, Search, User as UserIcon, Mail, Calendar, Link as LinkIcon } from "lucide-react";
import { type User, type Project } from "@shared/schema";

interface ProfileResponse {
  user: User;
  projects: Project[];
}

export default function PublicProfile() {
  const { username } = useParams();
  const [, navigate] = useLocation();
  const [viewMode, setViewMode] = useState<"cards" | "timeline">("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [year, setYear] = useState<string>("");

  // Fetch profile data
  const { data, isLoading, isError } = useQuery<ProfileResponse>({
    queryKey: [`/api/profile/${username}`],
  });

  // Handle 404
  useEffect(() => {
    if (isError) {
      navigate("/not-found");
    }
  }, [isError, navigate]);

  // Extract data
  const user = data?.user;
  const projects = data?.projects || [];

  // Handle empty state
  if (!isLoading && !isError && projects.length === 0) {
    return (
      <Layout title={`${user?.username}'s Portfolio`}>
        <div className="max-w-2xl mx-auto text-center py-16">
          <Avatar className="h-20 w-20 mx-auto mb-4">
            <AvatarImage src={user?.profileImageUrl || ''} alt={user?.username || 'User'} />
            <AvatarFallback className="text-xl">
              {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {user?.firstName} {user?.lastName}
          </h1>
          {user?.username && (
            <p className="text-gray-600 dark:text-gray-400 mb-4">@{user.username}</p>
          )}
          {user?.bio && (
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-6">
              {user.bio}
            </p>
          )}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-8">
            <p className="text-yellow-800 dark:text-yellow-200">
              This user hasn't added any hackathon projects yet.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

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
    <Layout title={`${user?.username || 'User'}'s Portfolio`}>
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="mb-8">
          {isLoading ? (
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2 text-center sm:text-left">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-20 w-full max-w-md" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.profileImageUrl || ''} alt={user?.username || 'User'} />
                <AvatarFallback className="text-xl">
                  {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">@{user?.username}</p>
                {user?.bio && (
                  <p className="text-gray-600 dark:text-gray-300 max-w-md">
                    {user.bio}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="projects" className="space-y-8">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <div className="flex flex-wrap items-end justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
                Hackathon Portfolio
              </h2>
              <div className="w-full sm:w-auto flex flex-wrap items-center gap-3">
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

            {/* Empty state for filtered projects */}
            {!isLoading && !isError && filteredProjects.length === 0 && projects.length > 0 && (
              <div className="text-center py-16 px-4">
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
              </div>
            )}

            {/* Cards View */}
            {!isLoading && !isError && filteredProjects.length > 0 && viewMode === "cards" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    isPublic={true}
                  />
                ))}
              </div>
            )}

            {/* Timeline View */}
            {!isLoading && !isError && filteredProjects.length > 0 && viewMode === "timeline" && (
              <ProjectTimeline
                projects={filteredProjects}
                isPublic={true}
              />
            )}
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            {isLoading ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array(4).fill(0).map((_, i) => (
                    <Card key={i} className="bg-white dark:bg-gray-900">
                      <CardContent className="p-4 text-center">
                        <Skeleton className="h-8 w-8 mx-auto mb-2" />
                        <Skeleton className="h-4 w-20 mx-auto" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Card>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-40 mb-4" />
                    <div className="flex flex-wrap gap-2">
                      {Array(8).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-6 w-16" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Stats cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-white dark:bg-gray-900">
                    <CardContent className="p-4 text-center">
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {projects.length}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Projects</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white dark:bg-gray-900">
                    <CardContent className="p-4 text-center">
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {new Set(projects.flatMap(p => p.technologies || [])).size}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Technologies</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white dark:bg-gray-900">
                    <CardContent className="p-4 text-center">
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {new Set(projects.map(p => p.hackathonName)).size}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Hackathons</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white dark:bg-gray-900">
                    <CardContent className="p-4 text-center">
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {projects.filter(p => p.achievement).length}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Awards</p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Technologies */}
                {projects.length > 0 && (
                  <Card className="bg-white dark:bg-gray-900">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        Technologies Used
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(projects.flatMap(p => p.technologies || []))).map((tech, i) => (
                          <Badge key={i} variant="secondary" className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
