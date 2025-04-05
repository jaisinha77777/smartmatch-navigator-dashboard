
import { useState } from "react";
import { Job, Applicant } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FitBadge } from "@/components/ui/fit-badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  applicants: Applicant[];
  isLoading: boolean;
}

export function JobCard({ job, applicants, isLoading }: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="mb-4 overflow-hidden transition-all duration-200 animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between p-4 bg-secondary/50">
        <CardTitle className="text-xl">{job.title}</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-auto"
          disabled={isLoading}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 mr-1" />
          ) : (
            <ChevronDown className="h-4 w-4 mr-1" />
          )}
          {isExpanded ? "Hide" : "Show"} Applicants
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{job.description}</p>
          <div className="flex flex-wrap gap-1">
            {job.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {isExpanded && (
          <div className={cn("mt-4 space-y-2 animate-slide-in")}>
            <h3 className="font-medium">Applicants ({applicants.length})</h3>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : applicants.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No applicants found for this job.</p>
            ) : (
              <div className="space-y-3">
                {applicants.map((applicant) => (
                  <div
                    key={applicant.id}
                    className="p-3 rounded-md border bg-card animate-fade-in"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{applicant.name}</h4>
                      <FitBadge category={applicant.category} />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {applicant.resumeSummary}
                    </p>
                    <p className="text-xs text-muted-foreground italic border-l-2 border-muted pl-2">
                      {applicant.reasoning}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
