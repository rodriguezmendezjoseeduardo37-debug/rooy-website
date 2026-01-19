import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { getServerSession } from "next-auth";
// AHORA IMPORTAMOS authOptions EN LUGAR DE handler
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const client = createClient({
  projectId: "4fzbmelx",
  dataset: "produccion",
  useCdn: false,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
});

export async function GET() {
  // Pasamos authOptions a getServerSession
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  try {
    const email = session.user.email;
    
    // 1. Buscar ID del usuario
    const userQuery = `*[_type == "user" && email == $email][0]._id`;
    const userId = await client.fetch(userQuery, { email });

    if (!userId) {
       return NextResponse.json({ orders: [] });
    }

    // 2. Buscar sus órdenes
    const orders = await client.fetch(`
      *[_type == "order" && user._ref == $userId] | order(createdAt desc) {
        _id,
        orderNumber,
        createdAt,
        total,
        status,
        items[]{
          title,
          quantity,
          price,
          size
        }
      }
    `, { userId });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: "Error al obtener pedidos" }, { status: 500 });
  }
}