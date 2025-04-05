
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

// Evaluate a single applicant with custom criteria
export const evaluateApplicant = async (applicantId: number, criteria: string): Promise<void> => {
  try {
    // Get applicant details
    const { data: applicant, error: applicantError } = await supabase
      .from('applicants')
      .select('*, jobs!inner(*)')
      .eq('id', applicantId)
      .single();
    
    if (applicantError) throw applicantError;
    
    // Prepare the prompt with the custom criteria
    const evaluationData = {
      jobDescription: `${applicant.jobs.description}\n\nEvaluation Criteria: ${criteria}`,
      jobSkills: applicant.jobs.skills || [],
      resumeSummary: applicant.resume_summary
    };
    
    // Call the edge function
    const { data: response, error: functionError } = await supabase.functions.invoke(
      'evaluate-applicant', 
      { 
        body: JSON.stringify(evaluationData)
      }
    );
    
    if (functionError) throw functionError;
    
    // Update the applicant record with the new evaluation
    const { error: updateError } = await supabase
      .from('applicants')
      .update({
        category: response.category,
        reasoning: response.reasoning
      })
      .eq('id', applicantId);
    
    if (updateError) throw updateError;
    
    toast.success("Applicant evaluated successfully");
  } catch (error) {
    console.error("Error evaluating applicant:", error);
    toast.error("Failed to evaluate applicant");
    throw error;
  }
};

// Evaluate all applicants with the same criteria
export const evaluateAllApplicants = async (criteria: string): Promise<void> => {
  try {
    // Get all applicants
    const { data: applicants, error: applicantsError } = await supabase
      .from('applicants')
      .select('*');
    
    if (applicantsError) throw applicantsError;
    
    toast.info(`Evaluating ${applicants?.length || 0} applicants...`);
    
    // For each applicant, call the evaluate function
    for (const applicant of applicants || []) {
      try {
        await evaluateApplicant(applicant.id, criteria);
      } catch (error) {
        console.error(`Error evaluating applicant ${applicant.id}:`, error);
        // Continue with other applicants even if one fails
      }
    }
    
    toast.success("All applicants evaluated successfully");
  } catch (error) {
    console.error("Error evaluating all applicants:", error);
    toast.error("Failed to evaluate applicants");
    throw error;
  }
};
