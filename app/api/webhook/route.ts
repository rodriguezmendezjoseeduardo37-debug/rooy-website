import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { client } from "@/lib/sanity";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27-preview", // Asegúrate que coincida con tu versión
});

export async function POST(req: Request) {
  const body = await req.text(); // Leer como texto/buffer para la firma
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.CheckoutSession;
    
    // Aquí tu lógica para crear el pedido en Sanity
    await client.create({
      _type: "order",
      id: session.id,
      customerName: session.customer_details?.name,
      total: session.amount_total ? session.amount_total / 100 : 0,
      status: "paid",
      createdAt: new Date().toISOString(),
    });
  }

  return NextResponse.json({ received: true });
}
