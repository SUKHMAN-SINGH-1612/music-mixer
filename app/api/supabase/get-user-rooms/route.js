import { supabase } from "../../../supabase/client";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const google_id = searchParams.get("google_id");

    if (!google_id) {
      return new Response(JSON.stringify({ error: "Google ID is required" }), { status: 400 });
    }

    // Fetch room codes where the user is a member
    const { data: roomCodesData, error: roomCodesError } = await supabase
      .from("room_members")
      .select("room_code")
      .filter("members", "cs", `["${google_id}"]`);

    if (roomCodesError) throw roomCodesError;

    // Extract room codes
    const roomCodes = roomCodesData.map(room => room.room_code);

    // Fetch room names based on the room codes
    const { data: roomsData, error: roomsError } = await supabase
      .from("rooms")
      .select("room_code, room_name")
      .in("room_code", roomCodes);

    if (roomsError) throw roomsError;

    // Log the fetched room codes and room data for debugging
    console.log("Room Codes Data:", roomCodesData);
    console.log("Rooms Data:", roomsData);

    // Combine room codes with their names
    const combinedData = roomCodesData.map(roomCode => {
      const room = roomsData.find(r => r.room_code === roomCode.room_code);
      return {
        room_code: roomCode.room_code,
        room_name: room ? room.room_name : "Unknown Room",
      };
    });

    return new Response(JSON.stringify(combinedData), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}