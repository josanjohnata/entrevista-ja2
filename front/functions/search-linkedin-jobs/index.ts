/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface JobSearchParams {
  keywords: string;
  limit?: number;
  page?: number;
  location?: string;
  country?: string;
  datePosted?: string;
}

interface JobData {
  job_id: string;
  employer_name: string;
  employer_logo: string | null;
  job_title: string;
  job_city: string | null;
  job_country: string;
  job_posted_at_datetime_utc: string;
  job_apply_link: string | null;
  job_google_link: string | null;
  job_employment_type: string | null;
  job_required_experience?: {
    experience_level?: string;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    const { keywords, limit = 10, page = 1, location, country = 'br', datePosted = 'week' }: JobSearchParams = await req.json();

    if (!keywords || keywords.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Keywords are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const jsearchApiKey = Deno.env.get('JSEARCH_API_KEY') || Deno.env.get('RAPIDAPI_KEY');
    
    if (!jsearchApiKey) {
      return new Response(
        JSON.stringify({ error: 'JSearch API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build search query - if location includes city, use "keywords in City, CountryCode"
    // Otherwise, use "keywords in CountryCode"
    const query = location ? `${keywords} in ${location}` : keywords;
    
    const params = new URLSearchParams({
      query: query,
      page: String(page),
      num_pages: '1',
      country: country, // Use the provided country code
      date_posted: datePosted || 'week', // Only jobs from last week to avoid expired listings
    });

    console.log('Searching jobs with params:', params.toString());

    const response = await fetch(`https://jsearch.p.rapidapi.com/search?${params}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': jsearchApiKey,
        'x-rapidapi-host': 'jsearch.p.rapidapi.com',
      },
    });

    console.log('JSearch API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('JSearch API error:', errorText);
      
      if (response.status === 401 || response.status === 403) {
        return new Response(
          JSON.stringify({ error: 'API authentication failed. Please check your RapidAPI key.' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to fetch jobs. Please try again.' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('JSearch API data received, jobs count:', data.data?.length || 0);

    // Transform jobs data to our format
    const jobs = (data.data || []).slice(0, limit).map((job: JobData) => ({
      job_id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      company_logo: job.employer_logo,
      location: job.job_city 
        ? `${job.job_city}, ${job.job_country}` 
        : job.job_country,
      posted_date: job.job_posted_at_datetime_utc,
      job_url: job.job_apply_link || job.job_google_link || '',
      employment_type: formatEmploymentType(job.job_employment_type),
      seniority_level: job.job_required_experience?.experience_level || null,
    }));

    return new Response(
      JSON.stringify({
        jobs,
        page,
        hasMore: (data.data?.length || 0) >= limit,
        total: data.data?.length || 0,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: errorMessage,
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function formatEmploymentType(type: string | null): string | null {
  if (!type) return null;
  
  const typeMap: Record<string, string> = {
    'FULLTIME': 'Full-time',
    'PARTTIME': 'Part-time',
    'CONTRACTOR': 'Contrato',
    'INTERN': 'Estágio',
    'TEMPORARY': 'Temporário',
  };
  
  return typeMap[type.toUpperCase()] || type;
}
