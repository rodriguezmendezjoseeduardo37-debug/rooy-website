import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import Stripe from "stripe";

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Asegúrate de usar la versión que tienes configurada en tu dashboard

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
      // 1. Guardamos en Sanity
      await createOrderInSanity(session);
      
      // 2. Enviamos la notificación a Telegram
      await sendTelegramNotification(session);
      
      console.log("✅ Orden guardada y notificada a Telegram.");
    } catch (error) {
      console.error("❌ Error en el proceso post-pago:", error);
      return new NextResponse("Error procesando el pedido", { status: 500 });
    }
  }
  return new NextResponse("Recibido", { status: 200 });
}

/* FUNCIÓN DE NOTIFICACIÓN PARA TELEGRAM */
async function sendTelegramNotification(session: Stripe.Checkout.Session) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  // Si no tienes las llaves, no intenta enviar nada
  if (!token || !chatId) {
    console.log("⚠️ Faltan llaves de Telegram en las variables de entorno.");
    return;
  }

  const sessionAny = session as any;
  const name = sessionAny.shipping_details?.name || "Cliente ROOY";
  const cartItems: WebhookCartItem[] = JSON.parse(session.metadata?.cartItems || "[]");

  // Formateamos la lista de productos para el mensaje
  const itemsList = cartItems.map(item => 
    `• ${item.quantity}x ${item.title} (Talla: ${item.size})`
  ).join("\n");

  const total = session.amount_total ? session.amount_total / 100 : 0;
  
  const message = `🛍️ *¡NUEVA VENTA EN ROOY!*\n\n` +
                  `👤 *Cliente:* ${name}\n` +
                  `💰 *Total:* $${total} MXN\n\n` +
                  `📦 *Productos:*\n${itemsList}\n\n` +
                  `🆔 *Orden:* \`${session.id.slice(-8)}\``;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });
  } catch (err) {
    console.error("❌ Error enviando mensaje a Telegram:", err);
  }
}

async function createOrderInSanity(session: Stripe.Checkout.Session) {
  const cartItems: WebhookCartItem[] = JSON.parse(session.metadata?.cartItems || "[]");
  
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