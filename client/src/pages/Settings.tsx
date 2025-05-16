import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Username form schema
const usernameFormSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be 30 characters or less")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
});

// Profile form schema
const profileFormSchema = z.object({
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
});

type UsernameFormValues = z.infer<typeof usernameFormSchema>;
type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function Settings() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("account");

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    navigate("/");
    return null;
  }

  // Username form
  const usernameForm = useForm<UsernameFormValues>({
    resolver: zodResolver(usernameFormSchema),
    defaultValues: {
      username: user?.username || "",
    },
  });

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      bio: user?.bio || "",
    },
  });

  // Update username mutation
  const updateUsername = useMutation({
    mutationFn: async (data: UsernameFormValues) => {
      return await apiRequest("PUT", "/api/profile/username", data);
    },
    onSuccess: () => {
      toast({
        title: "Username updated",
        description: "Your username has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: any) => {
      if (error.message.includes("409")) {
        toast({
          title: "Username already taken",
          description: "Please choose a different username",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: `Failed to update username: ${error}`,
          variant: "destructive",
        });
      }
    },
  });

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      return await apiRequest("PUT", "/api/profile", data);
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update profile: ${error}`,
        variant: "destructive",
      });
    },
  });

  // Form submissions
  const onSubmitUsername = (data: UsernameFormValues) => {
    updateUsername.mutate(data);
  };

  const onSubmitProfile = (data: ProfileFormValues) => {
    updateProfile.mutate(data);
  };

  // Handle logout
  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <Layout title="Settings">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage your profile and account settings
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Manage your account details and username
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* User Info */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user?.profileImageUrl || ''} alt={user?.username || 'User'} />
                    <AvatarFallback className="text-lg">
                      {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {user?.firstName} {user?.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                </div>

                {/* Username Form */}
                <Form {...usernameForm}>
                  <form onSubmit={usernameForm.handleSubmit(onSubmitUsername)} className="space-y-4">
                    <FormField
                      control={usernameForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="username" {...field} />
                          </FormControl>
                          <FormDescription>
                            This will be used for your public profile URL: {window.location.origin}/{field.value || 'username'}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      disabled={updateUsername.isPending}
                      className="bg-primary-600 hover:bg-primary-700 text-white"
                    >
                      {updateUsername.isPending ? "Updating..." : "Update Username"}
                    </Button>
                  </form>
                </Form>

                {/* Logout */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    variant="destructive" 
                    onClick={handleLogout} 
                    className="w-full"
                  >
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-4">
                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about yourself and your experience with hackathons..." 
                              className="min-h-[120px] resize-y" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            This will be displayed on your public profile
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      disabled={updateProfile.isPending}
                      className="bg-primary-600 hover:bg-primary-700 text-white"
                    >
                      {updateProfile.isPending ? "Updating..." : "Update Profile"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
