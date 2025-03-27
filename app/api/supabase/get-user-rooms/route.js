import { supabase } from "../../../supabase/client";
import NodeCache from "node-cache";

// Create a cache instance with a TTL (time-to-live) of 60 seconds
const cache = new NodeCache({ stdTTL: 60 });

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const google_id = searchParams.get("google_id");

    if (!google_id) {
      return new Response(JSON.stringify({ error: "Google ID is required" }), { status: 400 });
    }

    // Check if the data is already in the cache
    const cachedData = cache.get(google_id);
    if (cachedData) {
      return new Response(JSON.stringify(cachedData), { status: 200 });
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

    // Fetch member counts for each room
    const { data: roomMembers, error: membersError } = await supabase
      .from("room_members")
      .select("room_code, members");

    if (membersError) throw membersError;

    // Map member counts to rooms
    const memberCounts = roomMembers.reduce((acc, item) => {
      acc[item.room_code] = item.members ? item.members.length : 0;
      return acc;
    }, {});

    // Combine room codes with their names and member counts
    const combinedData = roomCodesData.map(roomCode => {
      const room = roomsData.find(r => r.room_code === roomCode.room_code);
      return {
        room_code: roomCode.room_code,
        room_name: room ? room.room_name : "Unknown Room",
        members_count: memberCounts[roomCode.room_code] || 0,
      };
    });

    // Cache the combined data
    cache.set(google_id, combinedData);

    return new Response(JSON.stringify(combinedData), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}