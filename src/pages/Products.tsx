import { ShinyText } from "../components/ShinyText";

export default function ProductsPage() {
  return (
    <section>
      <p className="hero-kicker">
        <ShinyText text="Products" />
      </p>

      <div className="feature-grid">
        <article className="product-preview-card">
          <img src="nc/rustbanner.png" alt="rust" className="product-banner" />
          <div>
            <h2>Rust DMA</h2>
            <p>
              Get the ultimate advantage in Rust with our hardware DMA cheat.
              External wallhack, aimbot, and loot ESP stream to a second screen,
              leaving no trace on your PC. Undetected by EAC, easy to set up, no
              FPS drop. Featuring precise player radar, item filters, silent
              aim, and customizable visuals. Fully external, zero ban risk.
            </p>
            <button className="ghost-button">Purchase</button>
          </div>
        </article>
        <article className="product-preview-card">
          <img src="nc/csbanner.png" alt="cs2" className="product-banner" />
          <div>
            <h2>CS2 Internal</h2>
            <p>
              Experience unparalleled precision with our premium CS2 internal
              software. Enjoy a fully customizable aimbot and crisp ESP visuals.
              Dominate every match with seamless skin changer and detailed sound
              alerts. Built for performance and undetected stealth, our
              framework ensures maximum FPS while keeping you hidden.
            </p>
            <button className="ghost-button">Purchase</button>
          </div>
        </article>
      </div>
    </section>
  );
}
