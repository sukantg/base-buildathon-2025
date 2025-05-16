import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, Link, Calendar, Edit } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import { type Project } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function Profile() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    navigate("/");
    return null;
  }

  // Fetch user's projects
  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: isAuthenticated,
  });

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
      navigate("/settings");
    }
  };

  // Get recent projects (limited to 3)
  const recentProjects = projects
    ? [...projects]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3)
    : [];

  return (
    <Layout title="My Profile">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="bg-white dark:bg-gray-900 rounded-xl shadow-sm md:sticky md:top-6 h-fit">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                {authLoading ? (
                  <Skeleton className="h-24 w-24 rounded-full" />
                ) : (
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.profileImageUrl || ''} alt={user?.username || 'User'} />
                    <AvatarFallback className="text-xl">
                      {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className="mt-4 space-y-1">
                  {authLoading ? (
                    <>
                      <Skeleton className="h-6 w-32 mx-auto" />
                      <Skeleton className="h-4 w-24 mx-auto" />
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {user?.firstName} {user?.lastName}
                      </h2>
                      {user?.username && (
                        <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                {user?.email && (
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <Mail className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                )}
                
                {user?.username && (
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <Link className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm">{window.location.origin}/{user.username}</span>
                  </div>
                )}
                
                {user?.createdAt && (
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                {user?.bio && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {user.bio}
                    </p>
                  </div>
                )}
                
                <div className="pt-4 flex flex-col space-y-3">
                  <Button 
                    variant="primary" 
                    onClick={handleShareProfile}
                    className="w-full"
                  >
                    <Link className="h-4 w-4 mr-2" />
                    Share Profile
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/settings")}
                    className="w-full"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-white dark:bg-gray-900">
                <CardContent className="p-4 text-center">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {projectsLoading ? (
                      <Skeleton className="h-8 w-8 mx-auto" />
                    ) : (
                      projects?.length || 0
                    )}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Projects</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-900">
                <CardContent className="p-4 text-center">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {projectsLoading ? (
                      <Skeleton className="h-8 w-8 mx-auto" />
                    ) : (
                      new Set(projects?.flatMap(p => p.technologies || [])).size || 0
                    )}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Technologies</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-900">
                <CardContent className="p-4 text-center">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {projectsLoading ? (
                      <Skeleton className="h-8 w-8 mx-auto" />
                    ) : (
                      new Set(projects?.map(p => p.hackathonName)).size || 0
                    )}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Hackathons</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-900">
                <CardContent className="p-4 text-center">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {projectsLoading ? (
                      <Skeleton className="h-8 w-8 mx-auto" />
                    ) : (
                      projects?.filter(p => p.achievement)?.length || 0
                    )}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Awards</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Technologies */}
            {!projectsLoading && projects && projects.length > 0 && (
              <Card className="bg-white dark:bg-gray-900">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(projects?.flatMap(p => p.technologies || []))).map((tech, i) => (
                      <Badge key={i} variant="secondary" className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Recent Projects */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Projects</h3>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/portfolio")}
                  className="text-primary-600 dark:text-primary-400"
                >
                  View All
                </Button>
              </div>
              
              {projectsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="bg-white dark:bg-gray-900">
                      <CardContent className="p-0">
                        <Skeleton className="h-48 w-full rounded-t-xl" />
                        <div className="p-5 space-y-3">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-20 w-full" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : recentProjects.length > 0 ? (
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onEdit={(id) => navigate(`/edit-project/${id}`)}
                      onDelete={(id) => navigate(`/portfolio`)}
                    />
                  ))}
                </div>
              ) : (
                <Card className="bg-white dark:bg-gray-900 p-8 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
                      <User className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No projects yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                      Start adding your hackathon projects to showcase your skills and achievements.
                    </p>
                    <Button 
                      variant="primary"
                      onClick={() => navigate("/add-project")}
                    >
                      Add Your First Project
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
