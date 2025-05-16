import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Project } from "@shared/schema";
import { ExternalLink, Github, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface ProjectTimelineProps {
  projects: Project[];
  isPublic?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function ProjectTimeline({ 
  projects, 
  isPublic = false,
  onEdit,
  onDelete
}: ProjectTimelineProps) {
  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Timeline connector line */}
      <div className="absolute top-0 bottom-0 left-[19px] w-0.5 bg-gray-200 dark:bg-gray-700 z-0"></div>
      
      {projects.map((project) => (
        <div key={project.id} className="mb-10 ml-10 relative">
          {/* Dot */}
          <div className="absolute -left-10 mt-1 w-6 h-6 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center z-10">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          
          {/* Content */}
          <Card className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Badge variant="secondary" className="bg-accent-100 text-accent-800 dark:bg-accent-800 dark:text-accent-100">
                    {format(new Date(project.date), 'MMMM yyyy')}
                  </Badge>
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    {project.hackathonName}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  {project.demoUrl && (
                    <a 
                      href={project.demoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  )}
                  
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  
                  {project.devpostUrl && (
                    <a 
                      href={project.devpostUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {project.projectTitle}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {project.description}
              </p>
              
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.imageUrl && (
                  <img 
                    src={project.imageUrl} 
                    alt={project.projectTitle} 
                    className="w-full h-48 object-cover rounded-lg" 
                  />
                )}
                
                <div>
                  {project.achievement && (
                    <div className="mb-3">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Achievement</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{project.achievement}</div>
                    </div>
                  )}
                  
                  {project.teamSize && (
                    <div className="mb-3">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Team Size</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{project.teamSize} members</div>
                    </div>
                  )}
                  
                  {project.role && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">My Role</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{project.role}</div>
                    </div>
                  )}
                  
                  {!isPublic && (
                    <div className="flex space-x-2 mt-4">
                      {onEdit && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => onEdit(project.id)}
                          className="text-gray-600 dark:text-gray-400"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      )}
                      
                      {onDelete && (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => onDelete(project.id)}
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
