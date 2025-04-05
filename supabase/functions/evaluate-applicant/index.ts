
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from "https://esm.sh/@huggingface/inference@2.6.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize the Hugging Face inference client
const hf = new HfInference(Deno.env.get("HUGGINGFACE_API_KEY"))

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { jobDescription, jobSkills, resumeSummary } = await req.json()
    
    if (!jobDescription || !jobSkills || !resumeSummary) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create the prompt for the model
    const prompt = `
You are an AI recruiter. You need to evaluate if a candidate is a good fit for a job.

Job Description: ${jobDescription}
Required Skills: ${jobSkills.join(', ')}

Resume Summary: ${resumeSummary}

Based on the job description, required skills, and the candidate's resume summary, categorize the candidate as either:
1. "Good Fit"
2. "Maybe Fit"
3. "Not a Fit"

Also provide reasoning for your decision. Be concise but thorough.

Format your response as JSON with the following structure:
{ "category": "Good Fit|Maybe Fit|Not a Fit", "reasoning": "Your reasoning here" }
`

    // Use Hugging Face's mistralai/Mixtral-8x7B-Instruct-v0.1 model for evaluation
    // This is a strong open-source model that can handle this type of task well
    const result = await hf.textGeneration({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.5,
        return_full_text: false,
      },
    })
    
    console.log("Generated result:", result)
    
    // Parse the JSON response from the generated text
    try {
      // Find JSON in the response
      const jsonMatch = result.generated_text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const jsonStr = jsonMatch[0]
        const evaluation = JSON.parse(jsonStr)
        
        // Validate that the response has the expected format
        if (
          evaluation && 
          evaluation.category && 
          ['Good Fit', 'Maybe Fit', 'Not a Fit'].includes(evaluation.category) && 
          evaluation.reasoning
        ) {
          return new Response(
            JSON.stringify(evaluation),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }
      
      // If we couldn't parse the JSON or it doesn't have the expected format
      return new Response(
        JSON.stringify({ 
          error: "Failed to parse model response", 
          rawResponse: result.generated_text 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (error) {
      return new Response(
        JSON.stringify({ 
          error: "Failed to parse model response", 
          message: error.message, 
          rawResponse: result.generated_text 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error("Error in evaluate-applicant function:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
