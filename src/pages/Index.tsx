
import { useState, useEffect } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import { JobCard } from "@/components/job-card";
import { CriteriaEditor } from "@/components/criteria-editor";
import { fetchJobs, fetchApplicants, triggerRecategorize } from "@/services/api";
import { Job, Applicant } from "@/types";
import { toast } from "sonner";

const Index = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Record<number, Applicant[]>>({});
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(true);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState<boolean>(false);
  
  useEffect(() => {
    const loadJobs = async () => {
      setIsLoadingJobs(true);
      try {
        const data = await fetchJobs();
        setJobs(data);
        if (data.length > 0) {
          setSelectedJob(data[0]);
          loadApplicants(data[0].id);
        }
      } catch (error) {
        console.error("Failed to load jobs:", error);
        toast.error("Failed to load jobs. Please try again later.");
      } finally {
        setIsLoadingJobs(false);
      }
    };

    loadJobs();
  }, []);

  const loadApplicants = async (jobId: number) => {
    if (applicants[jobId]) return;
    
    setIsLoadingApplicants(true);
    try {
      const data = await fetchApplicants(jobId);
      setApplicants(prev => ({
        ...prev,
        [jobId]: data
      }));
    } catch (error) {
      console.error("Failed to load applicants:", error);
      toast.error("Failed to load applicants. Please try again later.");
    } finally {
      setIsLoadingApplicants(false);
    }
  };

  const handleTriggerRecategorize = async (jobId: number, criteria: string) => {
    try {
      await triggerRecategorize(jobId, criteria);
      // In a real implementation, we'd refetch the results after recategorization
      toast.success("Recategorization triggered successfully!");
    } catch (error) {
      console.error("Failed to trigger recategorization:", error);
      toast.error("Failed to recategorize applicants. Please try again later.");
      throw error;
    }
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
          <h2 className="text-lg font-medium">Dashboard</h2>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Job Listings</h3>
            </div>

            {isLoadingJobs ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No jobs found. Please add some jobs to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    applicants={applicants[job.id] || []}
                    isLoading={selectedJob?.id === job.id && isLoadingApplicants}
                  />
                ))}
              </div>
            )}

            {!isLoadingJobs && (
              <CriteriaEditor
                selectedJobId={selectedJob?.id ?? null}
                onTriggerRecategorize={handleTriggerRecategorize}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
