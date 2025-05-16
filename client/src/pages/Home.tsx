import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();

  // Redirect to portfolio if logged in
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/portfolio");
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <Layout title="HackLog">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 py-8">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Showcase Your Hackathon Journey
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              HackLog is your personal hackathon portfolio tool. Track your projects, share your achievements, and build your developer brand.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => window.location.href = "/api/login"}
                className="text-white font-medium"
              >
                Get Started
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <img 
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Hackathon team collaborating" 
              className="rounded-xl shadow-xl w-full"
            />
          </div>
        </div>

        <div className="py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Why Use HackLog?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Track Your Progress</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Maintain a record of all your hackathon projects in one organized place.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Share Your Portfolio</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get a unique URL to showcase your projects to recruiters and peers.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Showcase Your Skills</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Highlight the technologies and skills you've used in each project.
              </p>
            </div>
          </div>
        </div>

        <div className="py-16 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <img 
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Developer coding" 
              className="rounded-xl shadow-xl w-full"
            />
          </div>
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Stand Out To Employers
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              In a competitive job market, having a well-organized portfolio of your hackathon projects makes you stand out. Show potential employers concrete examples of your problem-solving skills, teamwork, and technical abilities.
            </p>
            <Button 
              variant="primary"
              onClick={() => window.location.href = "/api/login"}
              className="text-white"
            >
              Create Your Portfolio
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
