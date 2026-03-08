import { useEffect, useState } from 'react';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

type Props = {
  email: string;
  userId: string;
}

function Checkout({ email, userId }: Props) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function getTokenCheckout() {
      const resp = await fetch('https://entrevista-ja.onrender.com/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userId })
      });
      const json = await resp.json();

      setToken(json?.client_secret);
      return json;
    }
    getTokenCheckout();

  }, [email, userId]);


  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{ clientSecret: token }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  )
}

export default Checkout
