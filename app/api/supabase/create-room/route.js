import { supabase } from "../../../supabase/client";
import { nanoid } from "nanoid";

export async function POST(req) {
  try {
    const { room_name, google_id, email, name } = await req.json();
    const room_code = nanoid(6); // Generate a unique 6-character code
    const created_at = new Date().toISOString(); // Generate current timestamp

    const { data, error } = await supabase
      .from("rooms")
      .insert([{
        room_code,
        room_name,
        google_id,
        email,
        name,
        created_at, // Use the current timestamp
        active: true
      }])
      .select();

    if (error) throw error;

    return new Response(JSON.stringify(data[0]), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
