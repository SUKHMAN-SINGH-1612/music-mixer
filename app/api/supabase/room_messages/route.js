import { supabase } from "../../../supabase/client";

export async function POST(req) {
  try {
    const { room_code, google_id, message } = await req.json();

    if (!room_code || !google_id || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const { data, error } = await supabase
      .from("room_messages")
      .insert([{ room_code, google_id, message }]);

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}