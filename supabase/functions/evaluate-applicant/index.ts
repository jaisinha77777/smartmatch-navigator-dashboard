
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured in environment variables');
    }

    const { jobDescription, jobSkills, resumeSummary } = await req.json();

    console.log("Processing evaluation request:");
    console.log("Job skills:", jobSkills);
    console.log("Resume length:", resumeSummary.length);

    const systemPrompt = `
    You are an AI assistant that helps HR departments evaluate job applicants.
    You will be given a job description, required skills, and a resume summary.
    Your task is to evaluate whether the applicant is a good fit for the position.
    Categorize the applicant as either:
    - "Good Fit": The applicant meets almost all requirements and has relevant experience.
    - "Maybe Fit": The applicant meets some requirements but lacks in other areas.
    - "Not a Fit": The applicant does not meet the core requirements for the position.
    
    Provide a brief reasoning for your decision (1-2 sentences only).
    Return ONLY a JSON object with two fields: 
    - "category": one of the three categories above
    - "reasoning": your brief explanation
    `;

    const userPrompt = `
    Job Description:
    ${jobDescription}
    
    Required Skills:
    ${jobSkills.join(', ')}
    
    Resume Summary:
    ${resumeSummary}
    `;

    console.log("Sending request to OpenAI...");
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3, // Lower temperature for more consistent results
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API Error:", JSON.stringify(errorData, null, 2));
        
        // Check if it's a quota error
        if (errorData.error?.code === "insufficient_quota") {
          // Provide a fallback response instead of failing
          return new Response(JSON.stringify({
            category: "Maybe Fit",
            reasoning: "Unable to evaluate due to OpenAI API quota limits. Please check your API subscription."
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          });
        }
        
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const result = await response.json();
      const aiResponse = result.choices[0].message.content;
      console.log("OpenAI Response:", aiResponse);

      try {
        // Try to parse the JSON response from the AI
        const parsedResponse = JSON.parse(aiResponse);
        
        // Validate the format
        if (!parsedResponse.category || !parsedResponse.reasoning) {
          throw new Error("Response missing required fields");
        }
        
        // Ensure the category is one of the expected values
        if (!["Good Fit", "Maybe Fit", "Not a Fit"].includes(parsedResponse.category)) {
          parsedResponse.category = "Maybe Fit"; // Default if category is invalid
        }
        
        return new Response(JSON.stringify(parsedResponse), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError);
        
        // Attempt to extract category and reasoning if JSON parsing fails
        let category = "Maybe Fit";
        let reasoning = "Could not determine fit based on available information.";
        
        if (aiResponse.includes("Good Fit")) {
          category = "Good Fit";
        } else if (aiResponse.includes("Not a Fit")) {
          category = "Not a Fit";
        }
        
        // Extract some reasoning text
        const reasoningMatch = aiResponse.match(/reasoning"?\s*:?\s*"?([^"]+)"?/i);
        if (reasoningMatch && reasoningMatch[1]) {
          reasoning = reasoningMatch[1].trim();
        }
        
        return new Response(JSON.stringify({
          category,
          reasoning
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } catch (openAIError) {
      console.error("OpenAI API call error:", openAIError);
      
      // Return a graceful fallback
      return new Response(JSON.stringify({
        category: "Maybe Fit",
        reasoning: "Could not perform evaluation due to API service issues."
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Still return 200 to not break the client flow
      });
    }
  } catch (error) {
    console.error("Error processing request:", error.message);
    return new Response(JSON.stringify({
      error: error.message,
      category: "Maybe Fit",
      reasoning: "An error occurred during evaluation."
    }), {
      status: 200, // Changed from 500 to 200 to prevent client errors
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
