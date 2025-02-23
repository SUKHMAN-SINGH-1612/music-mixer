import { supabase } from "../../../supabase/client";

export async function POST(req) {
  try {
    const { google_id, email, name } = await req.json();

    // Check if user already exists
    let { data: existingUser, error: userError } = await supabase
      .from("users")
      .select("google_id")
      .eq("google_id", google_id)
      .single();

    if (userError && userError.code !== 'PGRST116') throw userError;

    if (!existingUser) {
      // Insert new user
      const { error: insertError } = await supabase
        .from("users")
        .insert([{ google_id, email, name }]);

      if (insertError) throw insertError;
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
