import { supabase } from "../../../supabase/client";
import { nanoid } from "nanoid";

export async function POST(req) {
  try {
    const { room_name, google_id, email, name } = await req.json();
    const room_code = nanoid(6); // Generate a unique 6-character code
    const created_at = new Date().toISOString(); // Generate current timestamp

    // Insert new room
    const { data: roomData, error: roomError } = await supabase
      .from("rooms")
      .insert([{
        room_code,
        room_name,
        google_id,
        email,
        name,
        created_at,
        active: true
      }])
      .select();

    if (roomError) throw roomError;

    // Insert into room_members
    const { error: memberError } = await supabase
      .from("room_members")
      .insert([{
        room_code,
        members: [google_id] // Directly use an array
      }]);

    if (memberError) throw memberError;

    return new Response(JSON.stringify(roomData[0]), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
