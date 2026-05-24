import { ShinyText } from "../components/ShinyText";
import { Product, type ProductPlan } from "../components/Product";

type PurchasePageProps = {
  onSelectPlan: (plan: ProductPlan) => void;
};

const plans: ProductPlan[] = [
  {
    id: "test",
    name: "test",
    price: "$",
    period: "test",
    tagline: "test",
    features: ["test", "test"],
  },
  {
    id: "test2",
    name: "test2",
    price: "₽",
    period: "test",
    tagline: "test",
    features: ["test", "test"],
  },
];

export default function PurchasePage({ onSelectPlan }: PurchasePageProps) {
  return (
    <section>
      <p className="hero-kicker">
        <ShinyText text="Purchase" />
      </p>

      <section className="plans-grid">
        {plans.map((plan) => (
          <Product key={plan.id} plan={plan} onSelect={onSelectPlan} />
        ))}
      </section>
    </section>
  );
}
