
import { useState } from "react";
import { Applicant } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FitBadge } from "@/components/ui/fit-badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApplicantCardProps {
  applicant: Applicant;
  onEvaluate?: () => void;
  isEvaluating?: boolean;
}

export function ApplicantCard({ applicant, onEvaluate, isEvaluating = false }: ApplicantCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="mb-4 overflow-hidden transition-all duration-200 animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between p-4 bg-secondary/50">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium">{applicant.name}</h3>
            <FitBadge category={applicant.category} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Job ID: {applicant.jobId}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onEvaluate && (
            <Button
              size="sm"
              variant="outline"
              onClick={onEvaluate}
              disabled={isEvaluating}
            >
              {isEvaluating ? "Evaluating..." : "Evaluate"}
            </Button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-full hover:bg-secondary"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="bg-secondary/20 p-3 rounded-md">
            <h4 className="text-sm font-medium mb-1">Resume Summary</h4>
            <p className="text-sm">{applicant.resumeSummary}</p>
          </div>
          
          {isExpanded && (
            <div className="mt-4 space-y-2 animate-slide-in">
              <div className="bg-secondary/20 p-3 rounded-md">
                <h4 className="text-sm font-medium mb-1">AI Reasoning</h4>
                <p className="text-sm italic">{applicant.reasoning}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
