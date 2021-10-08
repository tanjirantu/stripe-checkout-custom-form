import './App.css';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./components/CheckoutForm"

const stripePromise = loadStripe("pk_test_51J6nFYHgGxrAF2GIW7hW5slBmOCkLEKltHn1850e2S9a8u3F2fqxfS6yOPKCKyu3Ipa0Z7eHgb8IQ4rMjL9x18hc008kJQfOEs")

function App() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

export default App;
