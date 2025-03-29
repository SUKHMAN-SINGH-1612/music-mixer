import { supabase } from "../../../supabase/client";

export async function POST(req) {
  try {
    const { room_code, google_id } = await req.json();

    // Fetch the current members of the room
    const { data: roomMembers, error: fetchError } = await supabase
      .from("room_members")
      .select("members")
      .eq("room_code", room_code)
      .single();

    if (fetchError || !roomMembers) {
      return new Response(JSON.stringify({ error: "Room not found or error fetching members" }), { status: 404 });
    }

    const updatedMembers = roomMembers.members.filter((id) => id !== google_id);

    // Update the room members
    const { error: updateError } = await supabase
      .from("room_members")
      .update({ members: updatedMembers })
      .eq("room_code", room_code);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
