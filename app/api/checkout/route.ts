import { NextResponse } from "next/server";
import Stripe from "stripe";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ message: "Falta STRIPE_SECRET_KEY" }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    typescript: true,
  });

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { cart } = body;

    if (!cart || cart.length === 0) {
      return NextResponse.json({ message: "Carrito vacío" }, { status: 400 });
    }

    const lineItems = cart.map((item: any) => {
      return {
        price_data: {
          currency: "mxn",
          product_data: {
            name: item.title,
            images: [], 
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    // --- SECCIÓN CORREGIDA ---
  const stripeSession = await stripe.checkout.sessions.create({
  line_items: lineItems,
  mode: "payment",
  /* ACTIVA LA RECOLECCIÓN DE DIRECCIÓN */
  shipping_address_collection: {
    allowed_countries: ['MX'], 
  },
  success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.NEXTAUTH_URL}/checkout`,
  customer_email: session.user.email!,
  metadata: {
    userId: (session.user as any).id || "", 
    cartItems: JSON.stringify(
      cart.map((item: any) => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        size: item.size || "Unitalla",
      }))
    ),
  },
});

    return NextResponse.json({ url: stripeSession.url });

  } catch (error: any) {
    console.error("Error Stripe:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}