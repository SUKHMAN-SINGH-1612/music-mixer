import { supabase } from "../../../supabase/client";

export async function POST(req) {
  try {
    const { room_code, google_id } = await req.json();

    // Verify the user is the creator of the room
    const { data: room, error: fetchError } = await supabase
      .from("rooms")
      .select("google_id")
      .eq("room_code", room_code)
      .single();

    if (fetchError || !room || room.google_id !== google_id) {
      console.error("Authorization or room fetch error:", fetchError);
      return new Response(JSON.stringify({ error: "Unauthorized or room not found" }), { status: 403 });
    }

    // Delete the room from the room_members table (child table)
    const { error: deleteMembersError } = await supabase
      .from("room_members")
      .delete()
      .eq("room_code", room_code);

    if (deleteMembersError) {
      console.error("Error deleting room members:", deleteMembersError);
      throw deleteMembersError;
    }

    // Delete the room from the playlist table (child table)
    const { error: deletePlaylistError } = await supabase
      .from("playlist")
      .delete()
      .eq("room_code", room_code);

    if (deletePlaylistError) {
      console.error("Error deleting playlist:", deletePlaylistError);
      throw deletePlaylistError;
    }

    // Delete the room from the rooms table (parent table)
    const { error: deleteRoomError } = await supabase
      .from("rooms")
      .delete()
      .eq("room_code", room_code);

    if (deleteRoomError) {
      console.error("Error deleting room:", deleteRoomError);
      throw deleteRoomError;
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Unhandled error in delete-room API:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
