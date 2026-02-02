import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface FormData {
  cardNumber: string;
  cardHolderName: string;
  expMonth: string;
  expYear: string;
  cvv: string;
  saveCard: boolean;
}

interface FormErrors {
  cardNumber?: string;
  cardHolderName?: string;
  expMonth?: string;
  expYear?: string;
  cvv?: string;
}

export default function CreditCardPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    cardNumber: "",
    cardHolderName: "",
    expMonth: "",
    expYear: "",
    cvv: "",
    saveCard: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (name === "cardNumber") {
      setFormData((prev) => ({ ...prev, cardNumber: formatCardNumber(value) }));
    } else if (name === "cvv") {
      setFormData((prev) => ({
        ...prev,
        cvv: value.replace(/\D/g, "").slice(0, 4),
      }));
    } else if (name === "expMonth") {
      setFormData((prev) => ({
        ...prev,
        expMonth: value.replace(/\D/g, "").slice(0, 2),
      }));
    } else if (name === "expYear") {
      setFormData((prev) => ({
        ...prev,
        expYear: value.replace(/\D/g, "").slice(0, 4),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    const cardDigits = formData.cardNumber.replace(/\s/g, "");
    if (cardDigits.length !== 16) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }

    if (!formData.cardHolderName.trim()) {
      newErrors.cardHolderName = "Card holder name is required";
    }

    const month = parseInt(formData.expMonth);
    if (!formData.expMonth || month < 1 || month > 12) {
      newErrors.expMonth = "Invalid month";
    }

    const year = parseInt(formData.expYear);
    const currentYear = new Date().getFullYear();
    if (!formData.expYear || year < currentYear || year > currentYear + 20) {
      newErrors.expYear = "Invalid year";
    }

    if (formData.cvv.length < 3 || formData.cvv.length > 4) {
      newErrors.cvv = "CVV must be 3-4 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Get card number without spaces
      const cardNumber = formData.cardNumber.replace(/\s/g, "");
      // Get last 4 digits for masked pan
      const maskedPan = "**** **** **** " + cardNumber.slice(-4);
      // Detect card type
      const cardType = cardNumber.startsWith("4")
        ? "VISA"
        : cardNumber.startsWith("5")
          ? "MASTERCARD"
          : "CARD";
      // Generate mock token
      const mockToken = `mock_tok_${Date.now()}`;

      // Include all card data in redirect URL
      const params = new URLSearchParams({
        success: "true",
        order: "123456",
        amount_cents: "100",
        // Card data for backend
        token: mockToken,
        masked_pan: maskedPan,
        card_type: cardType,
        card_holder: formData.cardHolderName,
        exp_month: formData.expMonth,
        exp_year: formData.expYear,
        save_card: formData.saveCard.toString(),
      });

      navigate(`/result?${params.toString()}`);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <span className="header-title">Credit Card</span>
        <div className="card-logos">
          <svg width="50" height="16" viewBox="0 0 50 16" fill="none">
            <text x="0" y="13" fill="#1A1F71" fontWeight="bold" fontSize="14">
              VISA
            </text>
          </svg>
          <svg width="32" height="20" viewBox="0 0 32 20">
            <circle cx="10" cy="10" r="10" fill="#EB001B" />
            <circle cx="22" cy="10" r="10" fill="#F79E1B" />
            <path d="M16 3.5a10 10 0 0 0 0 13" fill="#FF5F00" />
          </svg>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="cardNumber"
            className={`form-input ${errors.cardNumber ? "error" : ""}`}
            placeholder="Card Number"
            value={formData.cardNumber}
            onChange={handleChange}
          />
          {errors.cardNumber && (
            <span className="error-message">{errors.cardNumber}</span>
          )}
        </div>

        <div className="form-group">
          <input
            type="text"
            name="cardHolderName"
            className={`form-input ${errors.cardHolderName ? "error" : ""}`}
            placeholder="Card Holder Name"
            value={formData.cardHolderName}
            onChange={handleChange}
          />
          {errors.cardHolderName && (
            <span className="error-message">{errors.cardHolderName}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <input
              type="text"
              name="expMonth"
              className={`form-input ${errors.expMonth ? "error" : ""}`}
              placeholder="Exp. Month"
              value={formData.expMonth}
              onChange={handleChange}
            />
            {errors.expMonth && (
              <span className="error-message">{errors.expMonth}</span>
            )}
          </div>
          <div className="form-group">
            <input
              type="text"
              name="expYear"
              className={`form-input ${errors.expYear ? "error" : ""}`}
              placeholder="Exp. Year"
              value={formData.expYear}
              onChange={handleChange}
            />
            {errors.expYear && (
              <span className="error-message">{errors.expYear}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <input
            type="text"
            name="cvv"
            className={`form-input ${errors.cvv ? "error" : ""}`}
            placeholder="CCV"
            value={formData.cvv}
            onChange={handleChange}
          />
          {errors.cvv && <span className="error-message">{errors.cvv}</span>}
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="saveCard"
            name="saveCard"
            checked={formData.saveCard}
            onChange={handleChange}
          />
          <label htmlFor="saveCard">save card</label>
        </div>

        <button type="submit" className="btn btn-primary btn-center">
          Pay
        </button>
      </form>

      <div className="footer">
        Powered by <strong>paymob</strong>.
      </div>
    </div>
  );
}
