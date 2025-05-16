import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Project } from "@shared/schema";
import { ExternalLink, Github, Edit, Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  isPublic?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function ProjectCard({ 
  project, 
  isPublic = false,
  onEdit,
  onDelete
}: ProjectCardProps) {
  const formattedDate = format(new Date(project.date), 'MMMM yyyy');
  
  // Format technologies array into badges
  const technologies = project.technologies || [];
  
  return (
    <Card className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Project Image */}
      {project.imageUrl && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={project.imageUrl} 
            alt={project.projectTitle} 
            className="w-full h-48 object-cover"
          />
        </div>
      )}
      
      <CardContent className="p-5">
        <div className="flex items-center mb-3">
          <Badge variant="secondary" className="bg-accent-100 text-accent-800 dark:bg-accent-800 dark:text-accent-100">
            {formattedDate}
          </Badge>
          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
            {project.hackathonName}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {project.projectTitle}
        </h3>
        
        <p className={cn(
          "text-gray-600 dark:text-gray-300 mb-4",
          isPublic ? "" : "line-clamp-3"
        )}>
          {project.description}
        </p>
        
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {technologies.map((tech, index) => (
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
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-3">
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
          
          {isPublic ? (
            <Button variant="ghost" size="sm" className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
          ) : (
            <div className="flex space-x-2">
              {onEdit && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEdit(project.id)}
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              
              {onDelete && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDelete(project.id)}
                  className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
