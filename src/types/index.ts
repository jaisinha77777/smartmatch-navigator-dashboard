
export interface Job {
  id: number;
  title: string;
  description: string;
  skills: string[];
}

export interface Applicant {
  id: number;
  jobId: number;
  name: string;
  resumeSummary: string;
  category: 'Good Fit' | 'Maybe Fit' | 'Not a Fit';
  reasoning: string;
}
