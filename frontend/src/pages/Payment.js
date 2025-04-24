import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../components/PaymentForm";

const stripePromise = loadStripe('pk_test_51QtPHwHmnpb8AhXck6t31IJBnBcIUeCJ4CjFEMjqGAOzJDLEFKEWUYJfzbxi7UjZQF45NY9pBViaZ7LXDQAGoZGj00u6L0DOU1');

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state?.clientSecret) {
    navigate("/checkout");
    return null;
  }
/*Riceve il client secret da Stripe e avvia il form di pagamento, se non è presente torna al checkout */
  return (
    <Elements stripe={stripePromise} options={{ clientSecret: location.state.clientSecret }}>
      <PaymentForm />
    </Elements>
  );
};

export default Payment;
