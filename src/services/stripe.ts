import { loadStripe } from '@stripe/stripe-js';
import { auth } from '../lib/firebase';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export async function createCheckoutSession(planId: string, userId: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('Debes iniciar sesión');

  const token = await user.getIdToken();

  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ planId, userId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al crear sesión de pago');
  }

  const session = await response.json();
  const stripeInstance = await stripePromise;

  if (!stripeInstance) throw new Error('Error al cargar Stripe');

  const { error } = await (stripeInstance as any).redirectToCheckout({
    sessionId: session.id,
  });

  if (error) {
    throw new Error(error.message);
  }
}
