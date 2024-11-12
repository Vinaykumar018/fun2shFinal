// import { PaymentGateway } from '@type/index';

// /**
//  *
//  *  Utility method to find out is stripe is available as a active payment gateway
//  *
//  */
// export function isStripeAvailable(props: any) {
//   const { defaultPaymentGateway, paymentGateway } = props;

//   let processPaymentGatewayName = [];
//   for (let i = 0; i < paymentGateway.length; i++) {
//     processPaymentGatewayName.push(paymentGateway[i].name.toUpperCase());
//   }

//   // relation would be
//   //
//   // false false = false
//   // true false = true
//   // false true = true
//   // true true = true

//   // check if stripe exists in default payment gateway
//   let isStripeDefault = false;
//   if (defaultPaymentGateway?.toUpperCase() === PaymentGateway.STRIPE) {
//     isStripeDefault = true;
//   }

//   // check if stripe exists in selected payment gateways
//   let isStripeAsChosen = false;
//   if (processPaymentGatewayName.includes(PaymentGateway.STRIPE)) {
//     isStripeAsChosen = true;
//   }

//   let isStripeAvailable = false;
//   if (isStripeAsChosen || isStripeDefault) {
//     isStripeAvailable = true;
//   }

//   return isStripeAvailable;
// }


import { PaymentGateway } from '@type/index';

/**
 * Utility method to find out if Stripe is available as an active payment gateway
 */
export function isStripeAvailable(props: any) {
  // Check if props is defined and has the necessary properties
  if (!props || !props.paymentGateway || !props.defaultPaymentGateway) {
    return false; // or handle this case accordingly
  }

  const { defaultPaymentGateway, paymentGateway } = props;

  let processPaymentGatewayName = [];
  for (let i = 0; i < paymentGateway.length; i++) {
    processPaymentGatewayName.push(paymentGateway[i].name.toUpperCase());
  }

  // Check if Stripe exists in the default payment gateway
  let isStripeDefault = false;
  if (defaultPaymentGateway?.toUpperCase() === PaymentGateway.STRIPE) {
    isStripeDefault = true;
  }

  // Check if Stripe exists in selected payment gateways
  let isStripeAsChosen = false;
  if (processPaymentGatewayName.includes(PaymentGateway.STRIPE)) {
    isStripeAsChosen = true;
  }

  let isStripeAvailable = false;
  if (isStripeAsChosen || isStripeDefault) {
    isStripeAvailable = true;
  }

  return isStripeAvailable;
}
