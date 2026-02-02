import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface FormData {
  mpin: string;
  otp: string;
}

interface FormErrors {
  mpin?: string;
  otp?: string;
}

export default function MobileWalletPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const walletNumber = searchParams.get("wallet_number") || "01010101010";
  const amount = searchParams.get("amount") || "1";

  const [formData, setFormData] = useState<FormData>({
    mpin: "",
    otp: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Only allow digits, max 6
    const digits = value.replace(/\D/g, "").slice(0, 6);
    setFormData((prev) => ({ ...prev, [name]: digits }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.mpin.length !== 6) {
      newErrors.mpin = "MPIN must be 6 digits";
    }

    if (formData.otp.length !== 6) {
      newErrors.otp = "OTP must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Generate mock token
      const mockToken = `mock_wallet_tok_${Date.now()}`;
      const amountCents = (parseFloat(amount) * 100).toString();

      // Include wallet data in redirect URL
      const params = new URLSearchParams({
        success: "true",
        order: searchParams.get("order") || "123456",
        amount_cents: amountCents,
        // Wallet data for backend
        token: mockToken,
        wallet_number: walletNumber,
        payment_type: "mobile_wallet",
      });

      navigate(`/result?${params.toString()}`);
    }
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <div className="paymob-header">PAYMOB</div>

      <div className="checkout-section">
        <div className="checkout-header">
          <h1 className="checkout-title">CHECKOUT</h1>
          <svg width="80" height="50" viewBox="0 0 80 50">
            <circle cx="55" cy="25" r="25" fill="#EB001B" />
            <circle cx="75" cy="25" r="25" fill="#F79E1B" />
            <text x="50" y="45" fill="#2c3e50" fontSize="12" fontWeight="bold">
              mast
            </text>
          </svg>
        </div>

        <div className="info-row">
          <div className="info-label">WALLET NUMBER</div>
          <div className="info-value">{walletNumber}</div>
        </div>

        <div className="info-row">
          <div className="info-label">AMOUNT TO PAY</div>
          <div className="info-value">EGP {amount}</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">YOUR MPIN</label>
            <input
              type="password"
              name="mpin"
              className={`form-input ${errors.mpin ? "error" : ""}`}
              placeholder="******"
              value={formData.mpin}
              onChange={handleChange}
              maxLength={6}
            />
            {errors.mpin && (
              <span className="error-message">{errors.mpin}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">One Time Password</label>
            <input
              type="password"
              name="otp"
              className={`form-input ${errors.otp ? "error" : ""}`}
              placeholder="******"
              value={formData.otp}
              onChange={handleChange}
              maxLength={6}
            />
            {errors.otp && <span className="error-message">{errors.otp}</span>}
          </div>

          <button type="submit" className="btn btn-blue">
            Pay with Wallet
          </button>
        </form>
      </div>

      <div className="footer">
        © Payment is powered by <a href="#">Paymob</a>
      </div>
    </div>
  );
}
