import { useSearchParams } from "react-router-dom";

export default function ResultPage() {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success") === "true";

  return (
    <div className="container">
      <div className="result-container">
        {success ? (
          <>
            <div className="result-icon success">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="result-title success">Approved</h1>
            <p className="result-message">
              Thank you for using the online payment service.
              <br />
              <br />
              Your transaction has been approved successfully.
            </p>
          </>
        ) : (
          <>
            <div className="result-icon error">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="result-title error">Declined</h1>
            <p className="result-message">
              Thank you for using the online payment service.
              <br />
              <br />
              The transaction you have attempted to make has been declined. If
              this problem persists, please contact your service provider.
            </p>
          </>
        )}
      </div>

      <div className="footer">
        © Payment is powered by <a href="#">Paymob</a>
      </div>
    </div>
  );
}
