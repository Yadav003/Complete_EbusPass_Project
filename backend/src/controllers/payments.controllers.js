import { ApiError } from "../utils/ApiError.js";

const allowedPaymentStatuses = ["pending", "completed", "failed"];

export const validatePaymentDetails = (payment) => {
  if (!payment) {
    throw new ApiError(400, "Missing payment details");
  }

  const {
    status = "pending",
    amount,
    transactionId,
    method,
    date,
  } = payment;

  if (!allowedPaymentStatuses.includes(status)) {
    throw new ApiError(400, "Valid payment status is required");
  }

  const parsedAmount = Number(amount);
  if (Number.isNaN(parsedAmount)) {
    throw new ApiError(400, "Payment amount must be a valid number");
  }

  return {
    status,
    amount: parsedAmount,
    transactionId,
    method,
    date: date ? new Date(date) : new Date(),
  };
};