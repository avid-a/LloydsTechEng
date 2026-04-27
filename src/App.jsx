import React, { useMemo, useState } from "react";
import {
  Home,
  Info,
  PoundSterling,
  RotateCcw,
  Calculator,
  AlertCircle,
} from "lucide-react";
import "./App.css";

export default function App() {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    propertyPrice: 300000,
    deposit: 30000,
    termYears: 25,
    interestRate: 4.5,
    repaymentType: "Repayment",
  });

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const price = Number(form.propertyPrice) || 0;
  const deposit = Number(form.deposit) || 0;
  const years = Number(form.termYears) || 0;
  const rate = Number(form.interestRate) || 0;

  const errors = [];

  if (price <= 0) errors.push("Property price must be greater than £0.");
  if (deposit < 0) errors.push("Deposit cannot be negative.");
  if (deposit >= price && price > 0) errors.push("Deposit must be lower than the property price.");
  if (years <= 0) errors.push("Mortgage term must be greater than 0 years.");
  if (rate < 0) errors.push("Interest rate cannot be negative.");

  const isValid = errors.length === 0;

  const results = useMemo(() => {
    const loan = Math.max(price - deposit, 0);
    const months = years * 12;
    const monthlyRate = rate / 100 / 12;

    let monthly = 0;

    if (loan > 0 && months > 0) {
      if (form.repaymentType === "Interest only") {
        monthly = loan * monthlyRate;
      } else if (monthlyRate === 0) {
        monthly = loan / months;
      } else {
        monthly =
          (loan * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);
      }
    }

    return {
      loan,
      monthly: isValid ? monthly : 0,
      total: isValid ? monthly * months : 0,
      interest: isValid ? monthly * months - loan : 0,
      depositPercentage: price > 0 ? (deposit / price) * 100 : 0,
    };
  }, [price, deposit, years, rate, form.repaymentType, isValid]);

  const money = (value) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const reset = () => {
    setStep(1);
    setForm({
      propertyPrice: 300000,
      deposit: 30000,
      termYears: 25,
      interestRate: 4.5,
      repaymentType: "Repayment",
    });
  };

  const goNext = (nextStep) => {
    if (isValid) setStep(nextStep);
  };

  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          <div className="brand-icon">
            <Home size={22} />
          </div>

          <div>
            <p>Lloyds Technology Engineering</p>
            <strong>Mortgage Calculator Enhancement</strong>
          </div>
        </div>

        <button className="reset" onClick={reset}>
          <RotateCcw size={15} />
          Reset
        </button>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Customer-focused redesign</p>
          <h1>Understand your mortgage clearly</h1>
          <p>
            A responsive mortgage calculator designed to make repayments,
            interest and borrowing costs easier to understand before applying.
          </p>
        </div>

        <div className="hero-box">
          <span>Monthly estimate</span>
          <strong>{money(results.monthly)}</strong>
          <small>Based on your current inputs</small>
        </div>
      </section>

      <main className="grid">
        <aside className="sidebar">
          <h3>Calculation journey</h3>

          <Step active={step === 1} number="1" title="Property details" />
          <Step active={step === 2} number="2" title="Mortgage options" />
          <Step active={step === 3} number="3" title="Results summary" />

          <div className="note">
            <Info size={17} />
            <p>
              Clear labels, visible settings and validation messages make the
              calculator easier to use and more accessible.
            </p>
          </div>
        </aside>

        <section className="card">
          <div className="progress">
            <span>Step {step} of 3</span>
            <div>
              <div style={{ width: `${(step / 3) * 100}%` }}></div>
            </div>
          </div>

          {errors.length > 0 && (
            <div className="error-box">
              <AlertCircle size={18} />
              <div>
                {errors.map((error) => (
                  <p key={error}>{error}</p>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <>
              <h2>Property details</h2>
              <p className="section-text">
                Enter the main property and deposit details to begin the estimate.
              </p>

              <Input label="Property price" htmlFor="propertyPrice">
                <Currency
                  id="propertyPrice"
                  value={form.propertyPrice}
                  onChange={(value) => update("propertyPrice", value)}
                />
              </Input>

              <Input label="Deposit" htmlFor="deposit">
                <Currency
                  id="deposit"
                  value={form.deposit}
                  onChange={(value) => update("deposit", value)}
                />
              </Input>

              <Input label="Mortgage term" htmlFor="termYears">
                <NumberInput
                  id="termYears"
                  value={form.termYears}
                  suffix="years"
                  onChange={(value) => update("termYears", value)}
                />
              </Input>

              <button className="primary" onClick={() => goNext(2)}>
                Continue to options
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2>Mortgage options</h2>
              <p className="section-text">
                Adjust the interest rate and repayment type to compare possible
                mortgage outcomes.
              </p>

              <Input label="Interest rate" htmlFor="interestRate">
                <NumberInput
                  id="interestRate"
                  value={form.interestRate}
                  suffix="%"
                  step="0.1"
                  onChange={(value) => update("interestRate", value)}
                />
              </Input>

              <Input label="Repayment type" htmlFor="repaymentType">
                <select
                  id="repaymentType"
                  value={form.repaymentType}
                  onChange={(e) => update("repaymentType", e.target.value)}
                >
                  <option>Repayment</option>
                  <option>Interest only</option>
                </select>
              </Input>

              <div className="buttons">
                <button className="secondary" onClick={() => setStep(1)}>
                  Back
                </button>

                <button className="primary" onClick={() => goNext(3)}>
                  View results
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2>Your results</h2>
              <p className="section-text">
                This summary shows the estimated monthly payment, loan amount,
                total repayment and interest.
              </p>

              <div className="results">
                <ResultBox title="Monthly payment" value={money(results.monthly)} />
                <ResultBox title="Loan amount" value={money(results.loan)} />
                <ResultBox title="Total interest" value={money(results.interest)} />
                <ResultBox title="Total repayment" value={money(results.total)} />
              </div>

              <div className="info-box">
                <Info size={18} />
                <p>
                  This is an estimate only. Actual mortgage costs may vary based
                  on lender fees, credit checks and product eligibility.
                </p>
              </div>

              <div className="buttons">
                <button className="secondary" onClick={() => setStep(2)}>
                  Back
                </button>

                <button className="primary" onClick={reset}>
                  Start again
                </button>
              </div>
            </>
          )}
        </section>

        <aside className="summary">
          <div className="summary-title">
            <Calculator size={22} />
            <div>
              <h3>Live summary</h3>
              <p>Updates as you edit</p>
            </div>
          </div>

          <div className="monthly-card">
            <span>Estimated monthly payment</span>
            <strong>{money(results.monthly)}</strong>
          </div>

          <Row label="Property price" value={money(form.propertyPrice)} />
          <Row label="Deposit" value={money(form.deposit)} />
          <Row label="Deposit percentage" value={`${results.depositPercentage.toFixed(1)}%`} />
          <Row label="Loan amount" value={money(results.loan)} />
          <Row label="Interest rate" value={`${form.interestRate}%`} />
          <Row label="Term" value={`${form.termYears} years`} />
          <Row label="Repayment type" value={form.repaymentType} />
        </aside>
      </main>
    </div>
  );
}

function Step({ active, number, title }) {
  return (
    <div className={`step ${active ? "active" : ""}`}>
      <span>{number}</span>
      <strong>{title}</strong>
    </div>
  );
}

function Input({ label, htmlFor, children }) {
  return (
    <div className="input-group">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}

function Currency({ id, value, onChange }) {
  return (
    <div className="input-box">
      <PoundSterling size={16} />
      <input
        id={id}
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function NumberInput({ id, value, onChange, suffix, step = "1" }) {
  return (
    <div className="input-box">
      <input
        id={id}
        type="number"
        min="0"
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <span>{suffix}</span>
    </div>
  );
}

function ResultBox({ title, value }) {
  return (
    <div className="result-box">
      <p>{title}</p>
      <strong>{value}</strong>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}