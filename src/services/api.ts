
import { Job, Applicant } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

// Type definitions for database tables
type JobsRow = Database['public']['Tables']['jobs']['Row'];
type ApplicantsRow = Database['public']['Tables']['applicants']['Row'];
type EvaluationCriteriaRow = Database['public']['Tables']['evaluation_criteria']['Row'];

// Fetch all jobs from the Supabase database
export const fetchJobs = async (): Promise<Job[]> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*');
    
    if (error) throw error;
    
    // Transform database rows to match our Job type
    return data.map((job: JobsRow) => ({
      id: job.id,
      title: job.title,
      description: job.description,
      skills: job.skills
    }));
  } catch (error) {
    console.error("Error fetching jobs:", error);
    toast.error("Failed to fetch jobs");
    throw error;
  }
};

// Fetch applicants for a specific job
export const fetchApplicants = async (jobId: number): Promise<Applicant[]> => {
  try {
    const { data, error } = await supabase
      .from('applicants')
      .select('*')
      .eq('job_id', jobId);
    
    if (error) throw error;
    
    // Transform database rows to match our Applicant type
    return data.map((applicant: ApplicantsRow) => ({
      id: applicant.id,
      jobId: applicant.job_id,
      name: applicant.name,
      resumeSummary: applicant.resume_summary,
      category: applicant.category as 'Good Fit' | 'Maybe Fit' | 'Not a Fit',
      reasoning: applicant.reasoning
    }));
  } catch (error) {
    console.error("Error fetching applicants:", error);
    toast.error("Failed to fetch applicants");
    throw error;
  }
};

// Fetch all applicants
export const fetchAllApplicants = async (): Promise<Applicant[]> => {
  try {
    const { data, error } = await supabase
      .from('applicants')
      .select('*');
    
    if (error) throw error;
    
    // Transform database rows to match our Applicant type
    return data.map((applicant: ApplicantsRow) => ({
      id: applicant.id,
      jobId: applicant.job_id,
      name: applicant.name,
      resumeSummary: applicant.resume_summary,
      category: applicant.category as 'Good Fit' | 'Maybe Fit' | 'Not a Fit',
      reasoning: applicant.reasoning
    }));
  } catch (error) {
    console.error("Error fetching all applicants:", error);
    toast.error("Failed to fetch applicants");
    throw error;
  }
};

// Fetch job results (same as fetchApplicants for now)
export const fetchJobResults = async (jobId: number): Promise<Applicant[]> => {
  return fetchApplicants(jobId);
};

// Trigger recategorize with custom criteria
export const triggerRecategorize = async (jobId: number, criteria: string): Promise<void> => {
  try {
    // First, save the criteria to the database
    const { error: criteriaError } = await supabase
      .from('evaluation_criteria')
      .insert({
        job_id: jobId,
        criteria: criteria
      });
    
    if (criteriaError) throw criteriaError;
    
    // Get job details
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();
    
    if (jobError) throw jobError;
    
    // Get all applicants for the job
    const { data: applicants, error: applicantsError } = await supabase
      .from('applicants')
      .select('*')
      .eq('job_id', jobId);
    
    if (applicantsError) throw applicantsError;
    
    // For each applicant, call the edge function to re-evaluate
    for (const applicant of applicants || []) {
      try {
        // Prepare the prompt with the custom criteria
        const evaluationData = {
          jobDescription: `${jobData?.description}\n\nAdditional Evaluation Criteria: ${criteria}`,
          jobSkills: jobData?.skills || [],
          resumeSummary: applicant.resume_summary
        };
        
        // Call the edge function
        const { data: response, error: functionError } = await supabase.functions.invoke(
          'evaluate-applicant', 
          { 
            body: JSON.stringify(evaluationData)
          }
        );
        
        if (functionError) {
          console.error(`Error re-evaluating applicant ${applicant.id}:`, functionError);
          continue;
        }
        
        // Update the applicant record with the new evaluation
        const { error: updateError } = await supabase
          .from('applicants')
          .update({
            category: response.category,
            reasoning: response.reasoning
          })
          .eq('id', applicant.id);
        
        if (updateError) {
          console.error(`Error updating applicant ${applicant.id}:`, updateError);
        }
        
      } catch (error) {
        console.error(`Error re-evaluating applicant ${applicant.id}:`, error);
        // Continue with other applicants even if one fails
      }
    }
    
    toast.success("Applicants re-evaluated successfully");
  } catch (error) {
    console.error("Error triggering recategorization:", error);
    toast.error("Failed to recategorize applicants");
    throw error;
  }
};
