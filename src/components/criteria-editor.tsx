
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "lucide-react";

interface CriteriaEditorProps {
  selectedJobId: number | null;
  onTriggerRecategorize: (jobId: number, criteria: string) => Promise<void>;
}

export function CriteriaEditor({ selectedJobId, onTriggerRecategorize }: CriteriaEditorProps) {
  const [criteria, setCriteria] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!selectedJobId) {
      toast.error("Please select a job first");
      return;
    }

    if (!criteria.trim()) {
      toast.error("Please enter some criteria");
      return;
    }

    setIsSubmitting(true);
    try {
      await onTriggerRecategorize(selectedJobId, criteria);
      toast.success("Re-categorization triggered successfully");
    } catch (error) {
      console.error("Error triggering re-categorization:", error);
      toast.error("Failed to trigger re-categorization");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl">Prompt Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            placeholder="Enter custom selection criteria..."
            className="min-h-[150px] resize-none"
            value={criteria}
            onChange={(e) => setCriteria(e.target.value)}
            disabled={isSubmitting}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={!selectedJobId || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Re-categorize"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
