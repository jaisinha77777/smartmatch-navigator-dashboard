
import { useState, useEffect } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import { ApplicantCard } from "@/components/applicant-card";
import { fetchAllApplicants } from "@/services/api";
import { Applicant } from "@/types";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ApplicantsPage = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>('all');
  
  const applicantsPerPage = 5;
  
  useEffect(() => {
    const loadApplicants = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAllApplicants();
        setApplicants(data);
      } catch (error) {
        console.error("Failed to load applicants:", error);
        toast.error("Failed to load applicants. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadApplicants();
  }, []);

  const filteredApplicants = filter === 'all' 
    ? applicants 
    : applicants.filter(applicant => applicant.category === filter);
  
  // Calculate pagination
  const indexOfLastApplicant = currentPage * applicantsPerPage;
  const indexOfFirstApplicant = indexOfLastApplicant - applicantsPerPage;
  const currentApplicants = filteredApplicants.slice(indexOfFirstApplicant, indexOfLastApplicant);
  const totalPages = Math.ceil(filteredApplicants.length / applicantsPerPage);

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
          <h2 className="text-lg font-medium">Applicants</h2>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Applicant Profiles</h3>
              
              {/* Filter buttons */}
              <div className="flex gap-2">
                <button 
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-primary text-white' : 'bg-secondary text-secondary-foreground'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilter('Good Fit')}
                  className={`px-3 py-1 rounded-full text-sm ${filter === 'Good Fit' ? 'bg-fit-good text-white' : 'bg-fit-good-bg text-fit-good'}`}
                >
                  Good Fit
                </button>
                <button 
                  onClick={() => setFilter('Maybe Fit')}
                  className={`px-3 py-1 rounded-full text-sm ${filter === 'Maybe Fit' ? 'bg-fit-maybe text-white' : 'bg-fit-maybe-bg text-fit-maybe'}`}
                >
                  Maybe Fit
                </button>
                <button 
                  onClick={() => setFilter('Not a Fit')}
                  className={`px-3 py-1 rounded-full text-sm ${filter === 'Not a Fit' ? 'bg-fit-not text-white' : 'bg-fit-not-bg text-fit-not'}`}
                >
                  Not a Fit
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredApplicants.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No applicants found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentApplicants.map((applicant) => (
                  <ApplicantCard key={applicant.id} applicant={applicant} />
                ))}
                
                {totalPages > 1 && (
                  <Pagination className="mt-6">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink 
                            onClick={() => setCurrentPage(i + 1)}
                            isActive={currentPage === i + 1}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApplicantsPage;
