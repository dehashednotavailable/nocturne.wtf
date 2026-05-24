import { CheckCircle } from "@phosphor-icons/react";

export type ProductPlan = {
  id: string;
  name: string;
  price: string;
  period: string;
  tagline: string;
  features: string[];
};

type ProductProps = {
  plan: ProductPlan;
  onSelect: (plan: ProductPlan) => void;
};

export function Product({ plan, onSelect }: ProductProps) {
  return (
    <article className="plan-card">
      <h3 className="plan-name">{plan.name}</h3>
      <p className="plan-tagline">{plan.tagline}</p>
      <p className="plan-price">
        {plan.price}
        <span>{plan.period}</span>
      </p>

      <ul>
        {plan.features.map((feature) => (
          <li key={feature}>
            <CheckCircle size={18} weight="fill" />
            {feature}
          </li>
        ))}
      </ul>

      <button type="button" className="ghost-button" onClick={() => onSelect(plan)}>
        Select plan
      </button>
    </article>
  );
}
