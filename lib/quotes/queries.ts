import { createClient } from "@/lib/supabase/server";
import { PUBLIC_COLUMNS, type Quote, type WallSettings } from "@/lib/quotes/types";

const configured=()=>Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

/** Public reads always use the anonymous/RLS-scoped client. */
export async function getQuotes(limit=120):Promise<Quote[]> {
  if(!configured())return [];
  try {
    const supabase=await createClient();
    const {data,error}=await supabase.from("quotes").select(PUBLIC_COLUMNS).order("featured",{ascending:false}).order("created_at",{ascending:false}).limit(limit).abortSignal(AbortSignal.timeout(6000));
    if(error){console.error("Quote collection is unavailable");return [];}
    return (data??[]) as Quote[];
  } catch {return [];}
}
export async function getWallSettings():Promise<WallSettings> {
  const closed={instant_publish:false,accepting:false};
  if(!configured())return closed;
  try {
    const supabase=await createClient();
    const {data,error}=await supabase.from("wall_settings").select("instant_publish,accepting").eq("id",true).abortSignal(AbortSignal.timeout(6000)).single();
    return error?closed:data??closed;
  } catch {return closed;}
}
