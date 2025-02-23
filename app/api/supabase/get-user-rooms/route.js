import { supabase } from "../../../supabase/client";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const google_id = searchParams.get("google_id");

    if (!google_id) {
      return new Response(JSON.stringify({ error: "Google ID is required" }), { status: 400 });
    }

    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("google_id", google_id);

    if (error) throw error;

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}