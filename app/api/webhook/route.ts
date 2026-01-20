import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import Stripe from "stripe";
import { Resend } from 'resend';
export const dynamic = 'force-dynamic'; // Fuerza a que sea siempre dinámico

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

const resend = new Resend(process.env.RESEND_API_KEY);

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
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Error: ${error.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await createOrderInSanity(session);
      await sendTelegramNotification(session); // Notificación al móvil
      await sendOrderEmail(session); // Notificación al cliente
      console.log("Orden procesada y notificaciones enviadas");
    } catch (error) {
      console.error("Error en el procesamiento post-pago:", error);
      return new NextResponse("Error interno", { status: 500 });
    }
  }

  return new NextResponse("Recibido", { status: 200 });
}

/* NOTIFICACIÓN A TU TELÉFONO (TELEGRAM) */
async function sendTelegramNotification(session: Stripe.Checkout.Session) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const total = session.amount_total ? session.amount_total / 100 : 0;
  const customer = session.customer_details?.name;
  const orderId = session.id.slice(-8);

  const message = `🛍️ *¡Nueva Venta en ROOY!*\n\n` +
                  `👤 *Cliente:* ${customer}\n` +
                  `💰 *Total:* $${total} MXN\n` +
                  `🆔 *Orden:* \`${orderId}\``;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
    }),
  });
}

async function sendOrderEmail(session: Stripe.Checkout.Session) {
  if (!process.env.RESEND_API_KEY) return;

  await resend.emails.send({
    from: 'ROOY <ventas@tu-dominio.com>',
    to: [session.customer_details?.email || ""],
    subject: 'Confirmación de tu pedido en ROOY',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
        <h1 style="text-transform: uppercase; letter-spacing: 0.2em;">¡Gracias por tu compra!</h1>
        <p>Hola ${session.customer_details?.name}, hemos recibido tu pago correctamente.</p>
        <hr />
        <p><strong>Total:</strong> $${(session.amount_total || 0) / 100} MXN</p>
      </div>
    `
  });
}

async function createOrderInSanity(session: Stripe.Checkout.Session) {
  const cartItems: WebhookCartItem[] = JSON.parse(session.metadata?.cartItems || "[]");

  const orderObject = {
    _type: "order",
    orderNumber: session.id,
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