import { supabase } from "../../../supabase/client";

export async function POST(req) {
  try {
    const { room_code, google_id } = await req.json();

    // Check if the room exists
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("room_code")
      .eq("room_code", room_code)
      .single();

    if (roomError || !room) {
      return new Response(JSON.stringify({ error: "Room does not exist" }), { status: 404 });
    }

    // Check if the user is already a member
    const { data: roomMembers, error: memberError } = await supabase
      .from("room_members")
      .select("members")
      .eq("room_code", room_code)
      .single();

    if (memberError || !roomMembers) {
      return new Response(JSON.stringify({ error: "Room members not found" }), { status: 404 });
    }

    const members = roomMembers.members || [];
    if (members.includes(google_id)) {
      return new Response(JSON.stringify({ error: "User already in the room" }), { status: 400 });
    }

    // Add user to the room
    members.push(google_id);
    const { error: updateError } = await supabase
      .from("room_members")
      .update({ members })
      .eq("room_code", room_code);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}