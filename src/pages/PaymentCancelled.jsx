import { Link } from "react-router-dom";

export default function PaymentCancelled() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold mb-3">
        Payment Cancelled
      </h1>

      <p className="text-gray-600 mb-6">
        Your payment wasn't completed.
        You can return to the website and try again.
      </p>

      <Link
        to="/"
        className="rounded-lg bg-black px-6 py-3 text-white"
      >
        Return to Home
      </Link>
    </div>
  );
}