import { createClient } from "@/lib/supabase/server";
import { ShowroomManager } from "@/components/admin/ShowroomManager";
import type { ShowroomItemRow } from "@/lib/supabase/types";

export default async function AdminShowroomPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("showroom_items")
    .select("*")
    .order("order_index", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-semibold text-text">
        Витрина
      </h1>
      <ShowroomManager initialItems={(data as ShowroomItemRow[]) ?? []} />
    </div>
  );
}
