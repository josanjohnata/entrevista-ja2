/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { linkedinUrl } = await req.json();

    if (!linkedinUrl) {
      return new Response(
        JSON.stringify({ error: 'LinkedIn URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate LinkedIn URL format
    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/i;
    if (!linkedinRegex.test(linkedinUrl)) {
      return new Response(
        JSON.stringify({ error: 'Invalid LinkedIn URL format. Use: https://linkedin.com/in/username' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY');
    
    if (!rapidApiKey) {
      return new Response(
        JSON.stringify({ error: 'RapidAPI key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract username from LinkedIn URL
    const usernameMatch = linkedinUrl.match(/linkedin\.com\/in\/([\w-]+)/i);
    const username = usernameMatch ? usernameMatch[1] : '';
    
    if (!username) {
      return new Response(
        JSON.stringify({ error: 'Could not extract username from LinkedIn URL' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call Fresh LinkedIn Profile Data API - Get Profile Details endpoint
    // IMPORTANTE: Incluir TODOS os parâmetros para obter dados completos
    const apiUrl = `https://fresh-linkedin-profile-data.p.rapidapi.com/enrich-lead?linkedin_url=${encodeURIComponent(linkedinUrl)}&include_skills=true&include_certifications=true&include_publications=false&include_honors=false&include_volunteers=false&include_projects=false&include_patents=false&include_courses=true&include_organizations=true&include_profile_status=false&include_company_public_url=false`;
    console.log('Calling Fresh LinkedIn Profile Data API (enrich-lead) for:', username);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': 'fresh-linkedin-profile-data.p.rapidapi.com',
      },
    });

    console.log('RapidAPI response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('RapidAPI error (status ' + response.status + '):', errorText);
      
      if (response.status === 404) {
        return new Response(
          JSON.stringify({ error: 'LinkedIn profile not found. Make sure the profile is public and the URL is correct.' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 401 || response.status === 403) {
        return new Response(
          JSON.stringify({ error: 'API authentication failed. Please check your RapidAPI key is valid and you are subscribed to "Fresh LinkedIn Profile Data" API on RapidAPI.' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later or upgrade your RapidAPI plan.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to fetch LinkedIn profile. Please try again.' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const responseData = await response.json();
    console.log('RapidAPI profile data received:', JSON.stringify(responseData).substring(0, 800));

    // Check if API returned an error in the response body
    if (responseData.success === false || responseData.error) {
      console.error('API returned error:', responseData.message || responseData.error);
      return new Response(
        JSON.stringify({ error: responseData.message || responseData.error || 'Failed to fetch profile data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // The profile data might be nested under 'data' key
    const profileData = responseData.data || responseData;
    
    console.log('Profile data keys:', Object.keys(profileData));

    // Helper to safely convert to array
    const toArray = (val: any): any[] => {
      if (Array.isArray(val)) return val;
      if (val && typeof val === 'object') return Object.values(val);
      return [];
    };

    // Format the response from Fresh LinkedIn Profile Data API structure
    // IMPORTANTE: Passar TODOS os dados da API sem filtrar
    const formattedProfile = {
      ...profileData, // Incluir TODOS os campos da API original
      
      // Garantir campos básicos sempre existem
      full_name: profileData.full_name || profileData.fullName || profileData.name || `${profileData.first_name || profileData.firstName || ''} ${profileData.last_name || profileData.lastName || ''}`.trim() || '',
      headline: profileData.headline || profileData.title || profileData.sub_title || '',
      summary: profileData.summary || profileData.about || profileData.description || '',
      occupation: profileData.occupation || profileData.headline || profileData.title || '',
      
      // Garantir profile_pic_url sempre existe (a API pode retornar com nomes diferentes)
      profile_pic_url: profileData.profile_pic_url || profileData.profile_image_url || profileData.profilePicUrl || profileData.profileImageUrl || profileData.profile_photo || profileData.photo_url || '',
    };

    console.log('Formatted profile keys:', Object.keys(formattedProfile));
    console.log('Profile pic URL:', formattedProfile.profile_pic_url ? 'Present' : 'Missing');
    console.log('Experiences count:', formattedProfile.experiences?.length || 0);
    console.log('Educations count:', formattedProfile.educations?.length || 0);

    return new Response(
      JSON.stringify(formattedProfile),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      error: error
    });
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: errorMessage,
        details: errorStack ? errorStack.substring(0, 500) : undefined
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
