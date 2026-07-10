import { OrdersTable } from "@/components/admin/OrdersTable";
import { getAllOrders } from "@/lib/supabase/queries";

export const metadata = { title: "Заказы | Админ" };

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-semibold text-text">
        Заказы
      </h1>
      <OrdersTable orders={orders} />
    </div>
  );
}
