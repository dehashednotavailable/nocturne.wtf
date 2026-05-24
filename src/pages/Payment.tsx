import { ShinyText } from "../components/ShinyText";
import { CheckCircle, CreditCard } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import type { ProductPlan } from "../components/Product";

type PlanPageProps = {
  plan: ProductPlan | null;
};

const durations = [
  { id: "7", label: "7 days", multiplier: 1 },
  { id: "30", label: "30 days", multiplier: 3.2 },
  { id: "90", label: "90 days", multiplier: 8.5 },
  { id: "365", label: "365 days", multiplier: 30 },
];

function toNumber(price: string) {
  return Number(price.replace("$", ""));
}

export default function PlanPage({ plan }: PlanPageProps) {
  const selectedPlan =
    plan ??
    ({
      id: "test",
      name: "test",
      price: "$",
      period: "test",
      tagline: "test",
      features: [],
    } satisfies ProductPlan);

  const [selectedDurationId, setSelectedDurationId] = useState("30");

  const totalPrice = useMemo(() => {
    const duration = durations.find((item) => item.id === selectedDurationId);
    const base = toNumber(selectedPlan.price);

    if (!duration) {
      return base;
    }

    return Number((base * duration.multiplier).toFixed(2));
  }, [selectedDurationId, selectedPlan.price]);

  return (
    <section>
      <p className="hero-kicker">
        <ShinyText text="Plan setup" />
      </p>

      <article className="checkout-card">
        <h2>
          <CreditCard size={22} /> {selectedPlan.name}
        </h2>

        <div className="duration-grid">
          {durations.map((duration) => (
            <button
              key={duration.id}
              type="button"
              className={selectedDurationId === duration.id ? "is-active" : ""}
              onClick={() => setSelectedDurationId(duration.id)}
            >
              {duration.label}
            </button>
          ))}
        </div>

        <div className="order-summary">
          <p>Selected plan</p>
          <strong>{selectedPlan.name}</strong>
          <p>Duration</p>
          <strong>
            {durations.find((item) => item.id === selectedDurationId)?.label}
          </strong>
          <p>Total</p>
          <strong>${totalPrice}</strong>
        </div>

        <button type="button" className="ghost-button">
          <CheckCircle size={18} weight="fill" /> Continue to checkout
        </button>
      </article>
    </section>
  );
}
