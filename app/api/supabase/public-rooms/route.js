import { supabase } from "../../../supabase/client";

export async function GET(req) {
  try {
    const { data, error } = await supabase
      .from("rooms")
      .select("room_code, room_name")
      .eq("visibility", "public");

    if (error) {
      return new Response(JSON.stringify({ error: error.message, rooms: [] }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ rooms: data || [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, rooms: [] }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
