
import { Job, Applicant } from "@/types";

const API_BASE_URL = 'https://api.example.com'; // Replace with actual API base URL when available

export const fetchJobs = async (): Promise<Job[]> => {
  try {
    // Simulate API call with mock data for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            title: "Frontend Developer",
            description: "We're looking for a skilled frontend developer to join our team.",
            skills: ["React", "TypeScript", "Tailwind CSS"]
          },
          {
            id: 2,
            title: "Data Scientist",
            description: "Join our data science team to build machine learning models.",
            skills: ["Python", "TensorFlow", "SQL", "Data Visualization"]
          },
          {
            id: 3,
            title: "UX Designer",
            description: "Create beautiful user experiences for our web applications.",
            skills: ["Figma", "User Research", "Prototyping", "UI Design"]
          }
        ]);
      }, 800);
    });
    
    // When a real API is available:
    // const response = await fetch(`${API_BASE_URL}/jobs`);
    // if (!response.ok) throw new Error('Failed to fetch jobs');
    // return await response.json();
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

export const fetchApplicants = async (jobId: number): Promise<Applicant[]> => {
  try {
    // Simulate API call with mock data for now
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock applicants for different jobs
        const applicantsMap: Record<number, Applicant[]> = {
          1: [
            {
              id: 101,
              jobId: 1,
              name: "Jane Smith",
              resumeSummary: "5 years of experience with React, TypeScript, and frontend development. Led multiple teams in delivering high-quality web applications.",
              category: "Good Fit" as const,
              reasoning: "Strong React experience and leadership skills match job requirements. Technical skills align with all required technologies."
            },
            {
              id: 102,
              jobId: 1,
              name: "John Doe",
              resumeSummary: "3 years of Vue.js experience, some knowledge of React. Worked on several e-commerce websites.",
              category: "Maybe Fit" as const,
              reasoning: "Has frontend experience but primary framework is Vue.js rather than React. May need additional training."
            },
            {
              id: 103,
              jobId: 1,
              name: "Alex Johnson",
              resumeSummary: "Backend developer with Java and Spring Boot experience. Limited frontend exposure.",
              category: "Not a Fit" as const,
              reasoning: "Primarily backend focused with minimal frontend experience. Technology stack does not match job requirements."
            }
          ],
          2: [
            {
              id: 201,
              jobId: 2,
              name: "Maria Garcia",
              resumeSummary: "PhD in Computer Science with focus on machine learning. 3 years of industry experience with TensorFlow and PyTorch.",
              category: "Good Fit" as const,
              reasoning: "Strong academic background and industry experience in machine learning. Proficient in all required technologies."
            },
            {
              id: 202,
              jobId: 2,
              name: "David Kim",
              resumeSummary: "Data analyst with 2 years of experience. Familiar with SQL and basic Python. No machine learning experience.",
              category: "Maybe Fit" as const,
              reasoning: "Has data experience but lacks machine learning expertise. Would need significant training on ML frameworks."
            }
          ],
          3: [
            {
              id: 301,
              jobId: 3,
              name: "Sarah Lee",
              resumeSummary: "Senior UX designer with 7 years of experience. Proficient in Figma and user research methodologies.",
              category: "Good Fit" as const,
              reasoning: "Extensive UX experience and expertise in all required tools and methodologies. Great match for the position."
            },
            {
              id: 302,
              jobId: 3,
              name: "Michael Brown",
              resumeSummary: "Graphic designer with 4 years of experience. Skilled in Photoshop and Illustrator, limited UX experience.",
              category: "Maybe Fit" as const,
              reasoning: "Strong visual design skills but limited UX research experience. May need guidance on UX methodologies."
            },
            {
              id: 303,
              jobId: 3,
              name: "Emily Wilson",
              resumeSummary: "Recent graduate with a degree in computer science. Completed a UX design course online.",
              category: "Not a Fit" as const,
              reasoning: "Limited professional experience in UX design. Technical background is strong but practical UX skills need development."
            }
          ]
        };
        
        resolve(applicantsMap[jobId] || []);
      }, 800);
    });
    
    // When a real API is available:
    // const response = await fetch(`${API_BASE_URL}/applicants?jobId=${jobId}`);
    // if (!response.ok) throw new Error('Failed to fetch applicants');
    // return await response.json();
  } catch (error) {
    console.error("Error fetching applicants:", error);
    throw error;
  }
};

export const fetchAllApplicants = async (): Promise<Applicant[]> => {
  try {
    // Simulate API call with mock data for now
    return new Promise((resolve) => {
      setTimeout(() => {
        // Combine all applicants from different jobs
        const allApplicants: Applicant[] = [
          // Frontend Developer applicants
          {
            id: 101,
            jobId: 1,
            name: "Jane Smith",
            resumeSummary: "5 years of experience with React, TypeScript, and frontend development. Led multiple teams in delivering high-quality web applications.",
            category: "Good Fit",
            reasoning: "Strong React experience and leadership skills match job requirements. Technical skills align with all required technologies."
          },
          {
            id: 102,
            jobId: 1,
            name: "John Doe",
            resumeSummary: "3 years of Vue.js experience, some knowledge of React. Worked on several e-commerce websites.",
            category: "Maybe Fit",
            reasoning: "Has frontend experience but primary framework is Vue.js rather than React. May need additional training."
          },
          {
            id: 103,
            jobId: 1,
            name: "Alex Johnson",
            resumeSummary: "Backend developer with Java and Spring Boot experience. Limited frontend exposure.",
            category: "Not a Fit",
            reasoning: "Primarily backend focused with minimal frontend experience. Technology stack does not match job requirements."
          },
          // Data Scientist applicants
          {
            id: 201,
            jobId: 2,
            name: "Maria Garcia",
            resumeSummary: "PhD in Computer Science with focus on machine learning. 3 years of industry experience with TensorFlow and PyTorch.",
            category: "Good Fit",
            reasoning: "Strong academic background and industry experience in machine learning. Proficient in all required technologies."
          },
          {
            id: 202,
            jobId: 2,
            name: "David Kim",
            resumeSummary: "Data analyst with 2 years of experience. Familiar with SQL and basic Python. No machine learning experience.",
            category: "Maybe Fit",
            reasoning: "Has data experience but lacks machine learning expertise. Would need significant training on ML frameworks."
          },
          // UX Designer applicants
          {
            id: 301,
            jobId: 3,
            name: "Sarah Lee",
            resumeSummary: "Senior UX designer with 7 years of experience. Proficient in Figma and user research methodologies.",
            category: "Good Fit",
            reasoning: "Extensive UX experience and expertise in all required tools and methodologies. Great match for the position."
          },
          {
            id: 302,
            jobId: 3,
            name: "Michael Brown",
            resumeSummary: "Graphic designer with 4 years of experience. Skilled in Photoshop and Illustrator, limited UX experience.",
            category: "Maybe Fit",
            reasoning: "Strong visual design skills but limited UX research experience. May need guidance on UX methodologies."
          },
          {
            id: 303,
            jobId: 3,
            name: "Emily Wilson",
            resumeSummary: "Recent graduate with a degree in computer science. Completed a UX design course online.",
            category: "Not a Fit",
            reasoning: "Limited professional experience in UX design. Technical background is strong but practical UX skills need development."
          }
        ];
        
        resolve(allApplicants);
      }, 800);
    });
    
    // When a real API is available:
    // const response = await fetch(`${API_BASE_URL}/applicants`);
    // if (!response.ok) throw new Error('Failed to fetch all applicants');
    // return await response.json();
  } catch (error) {
    console.error("Error fetching all applicants:", error);
    throw error;
  }
};

export const fetchJobResults = async (jobId: number): Promise<Applicant[]> => {
  try {
    // In a real implementation, this would fetch from /results/{job_id}
    // For demo purposes, we're reusing the applicants endpoint
    return await fetchApplicants(jobId);
  } catch (error) {
    console.error("Error fetching job results:", error);
    throw error;
  }
};

export const triggerRecategorize = async (jobId: number, criteria: string): Promise<void> => {
  try {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Recategorizing job ${jobId} with criteria: ${criteria}`);
        resolve();
      }, 2000);
    });
    
    // When a real API is available:
    // const response = await fetch(`${API_BASE_URL}/categorize/${jobId}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ criteria })
    // });
    // if (!response.ok) throw new Error('Failed to trigger recategorization');
  } catch (error) {
    console.error("Error triggering recategorization:", error);
    throw error;
  }
};
