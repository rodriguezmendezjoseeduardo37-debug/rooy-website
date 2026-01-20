import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import Stripe from "stripe";

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  
});

interface WebhookCartItem {
  title: string;
  quantity: number;
  price: number;
  size: string;
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error: any) {
    return new NextResponse(`Error: ${error.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      await createOrderInSanity(session);
      console.log("✅ Orden guardada en Sanity con dirección.");
    } catch (error) {
      console.error("❌ Error en Sanity:", error);
      return new NextResponse("Error en Sanity", { status: 500 });
    }
  }
  return new NextResponse("Recibido", { status: 200 });
}

async function createOrderInSanity(session: Stripe.Checkout.Session) {
  const cartItems: WebhookCartItem[] = JSON.parse(session.metadata?.cartItems || "[]");
  
  // Usamos 'any' para evitar el error de TypeScript en la dirección
  const sessionAny = session as any;
  const addr = sessionAny.shipping_details?.address;
  const name = sessionAny.shipping_details?.name;
  const phone = sessionAny.customer_details?.phone || "Sin teléfono";

  const fullAddress = addr 
    ? `${name}\n${addr.line1} ${addr.line2 || ""}\nCP: ${addr.postal_code}, ${addr.city}, ${addr.state}\nTel: ${phone}`
    : "No proporcionada";

  const orderObject = {
    _type: "order",
    orderNumber: session.id,
    shippingAddress: fullAddress,
    user: session.metadata?.userId ? { _type: 'reference', _ref: session.metadata.userId } : undefined,
    items: cartItems.map((item: WebhookCartItem) => ({
      _key: Math.random().toString(36).substring(2),
      title: item.title,
      quantity: Number(item.quantity),
      price: Number(item.price),
      size: item.size
    })),
    total: session.amount_total ? session.amount_total / 100 : 0,
    status: "paid",
  };

  return await client.create(orderObject);
}