
import { useState, useEffect } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import { fetchJobs, triggerRecategorize } from "@/services/api";
import { Job } from "@/types";
import { toast } from "sonner";
import { CriteriaEditor } from "@/components/criteria-editor";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CriteriaPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      try {
        const data = await fetchJobs();
        setJobs(data);
        if (data.length > 0) {
          setSelectedJobId(data[0].id);
        }
      } catch (error) {
        console.error("Failed to load jobs:", error);
        toast.error("Failed to load jobs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, []);

  const handleJobChange = (value: string) => {
    setSelectedJobId(Number(value));
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r bg-sidebar">
        <div className="p-6">
          <h1 className="text-2xl font-bold">SmartMatch</h1>
          <p className="text-sm text-muted-foreground">AI Applicant Screening</p>
        </div>
        <div className="flex-1 px-4">
          <SidebarNav />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="border-b h-14 flex items-center px-6">
          <h2 className="text-lg font-medium">Criteria Editor</h2>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">Custom Evaluation Criteria</h3>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No jobs found. Please add some jobs to get started.</p>
              </div>
            ) : (
              <>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-xl">Select Job</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={selectedJobId?.toString()} onValueChange={handleJobChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a job" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobs.map((job) => (
                          <SelectItem key={job.id} value={job.id.toString()}>
                            {job.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {selectedJobId && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Job Description</h4>
                        <p className="text-sm text-muted-foreground">
                          {jobs.find(job => job.id === selectedJobId)?.description}
                        </p>
                        <div className="mt-3">
                          <h4 className="font-medium mb-1">Required Skills</h4>
                          <div className="flex flex-wrap gap-1">
                            {jobs.find(job => job.id === selectedJobId)?.skills.map((skill, index) => (
                              <span key={index} className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <CriteriaEditor
                  selectedJobId={selectedJobId}
                  onTriggerRecategorize={triggerRecategorize}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CriteriaPage;
