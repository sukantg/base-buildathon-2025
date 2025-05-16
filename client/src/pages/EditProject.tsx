import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertProjectSchema, type Project } from "@shared/schema";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";

// Extend insertProjectSchema with client validations
const formSchema = insertProjectSchema
  .extend({
    technologies: z.string().transform((val) => 
      val ? val.split(',').map(t => t.trim()).filter(Boolean) : []
    ),
    date: z.date()
  });

type FormValues = z.infer<typeof formSchema>;

export default function EditProject() {
  const { id } = useParams();
  const projectId = parseInt(id);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    navigate("/");
    return null;
  }

  // Fetch project data
  const { data: project, isLoading, isError } = useQuery<Project>({
    queryKey: [`/api/projects/${projectId}`],
    enabled: isAuthenticated && !isNaN(projectId),
  });

  // Setup form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hackathonName: "",
      projectTitle: "",
      description: "",
      date: new Date(),
      achievement: "",
      teamSize: undefined,
      role: "",
      demoUrl: "",
      githubUrl: "",
      devpostUrl: "",
      technologies: "",
      imageUrl: ""
    }
  });

  // Update form with project data when it loads
  useEffect(() => {
    if (project) {
      form.reset({
        ...project,
        date: new Date(project.date),
        technologies: project.technologies ? project.technologies.join(', ') : ''
      });
    }
  }, [project, form]);

  // Update project mutation
  const updateProject = useMutation({
    mutationFn: async (data: FormValues) => {
      return await apiRequest("PUT", `/api/projects/${projectId}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Project updated",
        description: "Your project has been updated successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}`] });
      navigate("/portfolio");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update project: ${error}`,
        variant: "destructive"
      });
    }
  });

  // Form submission
  const onSubmit = (data: FormValues) => {
    updateProject.mutate(data);
  };

  // Loading state
  if (isLoading) {
    return (
      <Layout title="Edit Project">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-8 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          
          <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (isError || !project) {
    return (
      <Layout title="Edit Project">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">
              Failed to load project. It may not exist or you may not have permission to edit it.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/portfolio")}
              className="mt-4"
            >
              Back to Portfolio
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Edit Project">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Project</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Update your hackathon project details
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Hackathon Name */}
              <FormField
                control={form.control}
                name="hackathonName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hackathon Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. HackMIT, TechCrunch Disrupt" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of the hackathon you participated in
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Project Title */}
              <FormField
                control={form.control}
                name="projectTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. EcoTrack, MindfulAI" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of your project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Hackathon Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "MMMM yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      The month and year of the hackathon
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your project, the problem it solves, and how it works..." 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Technologies */}
              <FormField
                control={form.control}
                name="technologies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technologies Used</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. React, Firebase, TensorFlow (comma separated)" {...field} />
                    </FormControl>
                    <FormDescription>
                      List the technologies you used, separated by commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Two columns layout for additional details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Achievement */}
                <FormField
                  control={form.control}
                  name="achievement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Achievement</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 1st Place, Best UI/UX" {...field} />
                      </FormControl>
                      <FormDescription>
                        Any awards or recognition received
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Team Size */}
                <FormField
                  control={form.control}
                  name="teamSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Size</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g. 4" 
                          min={1}
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => {
                            const value = e.target.value === '' ? undefined : parseInt(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Role */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Role</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Frontend Developer, ML Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image URL */}
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        An image showcasing your project
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Links section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Project Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Demo URL */}
                  <FormField
                    control={form.control}
                    name="demoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Demo URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://yourdemo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* GitHub URL */}
                  <FormField
                    control={form.control}
                    name="githubUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://github.com/username/repo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Devpost URL */}
                  <FormField
                    control={form.control}
                    name="devpostUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Devpost URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://devpost.com/software/project" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Form actions */}
              <div className="flex justify-end space-x-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/portfolio")}
                  disabled={updateProject.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={updateProject.isPending}
                  className="bg-primary-600 hover:bg-primary-700 text-white"
                >
                  {updateProject.isPending ? "Updating Project..." : "Update Project"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
}
