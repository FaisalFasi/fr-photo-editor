"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";
import { handleError } from "../utils";
import { connectToDatabase } from "../database/mongoose";
import { updateCredits } from "./user.actions";
import Transaction from "../models/transaction.model";

export async function checkoutCredits(transaction: CheckoutTransactionParams) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const amount = Number(transaction.amount) * 100;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: amount,
          product_data: {
            name: transaction.plan,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      plan: transaction.plan,
      credits: transaction.credits,
      buyerId: transaction.buyerId,
    },
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
  });

  redirect(session.url!);
}

export async function createTransaction(transaction: CreateTransactionParams) {
  try {
    await connectToDatabase();
    // Create a new transaction with a buyerId
    const newTransaction = await Transaction.create({
      ...transaction,
      buyer: transaction.buyerId,
    });

    await updateCredits(transaction.buyerId, transaction.credits);

    return JSON.parse(JSON.stringify(newTransaction));
  } catch (error) {
    handleError(error);
  }
}

// "use server";

// import Stripe from "stripe";
// import { redirect } from "next/navigation";
// import Transaction from "../models/transaction.model";
// import { updateCredits } from "./user.actions";
// import { handleError } from "../utils";
// import { connectToDatabase } from "../database/mongoose";

// // checkoutCredits is to checkout credits
// export async function checkoutCredits(transaction: CheckoutTransactionParams) {
//   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

//   const amount = Number(transaction.amount) * 100;
//   const session = await stripe.checkout.sessions.create({
//     //  line_items is to create a line item for the transaction with the price data and product data
//     line_items: [
//       {
//         price_data: {
//           currency: "usd",
//           unit_amount: amount,
//           product_data: {
//             name: transaction.plan,
//           },
//         },
//         quantity: 1,
//       },
//     ],
//     metadata: {
//       plan: transaction.plan,
//       credits: transaction.credits,
//       buyerId: transaction.buyerId,
//     },
//     mode: "payment",
//     success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
//     cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
//   });

//   redirect(session.url!);
// }

// // create a transaction
// export async function createTransaction(transaction: CreateTransactionParams) {
//   // create a transaction

//   await connectToDatabase();

//   try {
//     const newTransaction = await Transaction.create({
//       ...transaction,
//       buyer: transaction.buyerId,
//     });

//     await updateCredits(transaction.buyerId, transaction.credits);

//     return JSON.parse(JSON.stringify(newTransaction));
//   } catch (error) {
//     handleError(error);
//   }
// }
