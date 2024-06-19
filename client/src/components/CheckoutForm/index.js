import React, { useMemo, useState } from "react";
import {
    useStripe,
    useElements,
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement
} from "@stripe/react-stripe-js";
import axios from "axios";
import useResponsiveFontSize from "./useResponsiveFontSize";

const useOptions = () => {
    const fontSize = useResponsiveFontSize();
    const options = useMemo(
        () => ({
            style: {
                base: {
                    fontSize,
                    color: "#424770",
                    letterSpacing: "0.025em",
                    fontFamily: "Roboto, Source Code Pro, monospace, SFUIDisplay",
                    "::placeholder": {
                        color: "#aab7c4"
                    }
                },
                invalid: {
                    color: "#9e2146"
                },

            }
        }),
        [fontSize]
    );

    return options;
};

const SplitForm = () => {
    const [isProcessing, setProcessingTo] = useState(false);
    const [checkoutError, setCheckoutError] = useState();

    const stripe = useStripe();
    const elements = useElements();
    const options = useOptions();

    const handleCardDetailsChange = event => {
        event.error ? setCheckoutError(event.error.message) : setCheckoutError();
    };

    const handleSubmit = async (event) => {
        event.preventDefault()

        const data = await axios.post(`http://localhost:3001/create-payment-intent`, { amount: 15 })
            .then(response => response.data)
            .catch(error => console.log({ error }))

        if (data.clientSecret) {

            // your billing details object looks like this
            const billingDetails = {
                name: "John",
                email: "john@example.com",
                address: {
                    city: "New York",
                    line1: "896 Bell Street",
                    state: "New York",
                    postal_code: "	10022"
                }
            }

            setProcessingTo(true);

            const cardElement = elements.getElement(CardNumberElement)

            try {
                const paymentMethodReq = await stripe.createPaymentMethod({
                    type: "card",
                    card: cardElement,
                    billing_details: billingDetails
                });

                if (paymentMethodReq.error) {
                    setCheckoutError(paymentMethodReq.error.message);
                    setProcessingTo(false);
                    return;
                }


                const confirmedCardPayment = await stripe.confirmCardPayment(data.clientSecret, {
                    payment_method: paymentMethodReq.paymentMethod.id
                });

                if (confirmedCardPayment.error) {
                    setCheckoutError(confirmedCardPayment.error);
                    setProcessingTo(false);
                    return;
                }

                // display your success messages or redirect user to a success page
                console.log("Payment successful")
                setProcessingTo(false)
            } catch (err) {
                setCheckoutError(err.message)
            }

        } else {
            console.log("Error: Server could not initiate the payment process.")
        }
    }

    return (
        <form onSubmit={handleSubmit} >
            <label>
                <span>Card number</span>
                <CardNumberElement options={options} onChange={handleCardDetailsChange} />
            </label>
            <label>
                <span>Expiration date</span>

                <CardExpiryElement options={options} onChange={handleCardDetailsChange} />
            </label>
            <label>
                <span>CVC</span>
                <CardCvcElement options={options} onChange={handleCardDetailsChange} />
            </label>

            {/* {!checkoutError && <CheckoutError>{checkoutError}</CheckoutError>} */}
            <button
                className="checkout-button"
                type="submit"
                disabled={isProcessing || !stripe}
            >
                Checkout
            </button>
        </form>
    );

}

export default SplitForm;