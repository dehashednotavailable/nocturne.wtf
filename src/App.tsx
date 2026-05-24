import { useEffect, useEffectEvent, useState, type ReactNode } from "react";
import LineWaves from "./components/LineWaves";
import { Sidebar } from "./components/Sidebar";
import {
  ApiError,
  getCurrentSession,
  logoutAccount,
  type AuthResponse,
} from "./features/auth/api/auth-client";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import PlanPage from "./pages/Payment";
import ProductsPage from "./pages/Products";
import PurchasePage from "./pages/Purchase";
import RegisterPage from "./pages/Register";
import SettingsPage from "./pages/Settings";
import type { ProductPlan } from "./components/Product";

type AuthView = "login" | "register";
type AppView = "home" | "products" | "purchase" | "plan" | "settings";

const AVATAR_STORAGE_KEY = "nocturne-avatar";

export default function App() {
  const [authView, setAuthView] = useState<AuthView>("login");
  const [session, setSession] = useState<AuthResponse | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [appView, setAppView] = useState<AppView>("home");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ProductPlan | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");

  const loadSession = useEffectEvent(async () => {
    setIsCheckingSession(true);

    try {
      const currentSession = await getCurrentSession();
      setSession(currentSession);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setSession(null);
      }
    } finally {
      setIsCheckingSession(false);
    }
  });

  useEffect(() => {
    void loadSession();

    const cachedAvatar = window.localStorage.getItem(AVATAR_STORAGE_KEY);
    if (cachedAvatar) {
      setAvatarUrl(cachedAvatar);
    }
  }, []);

  const handleAvatarChange = (nextAvatar: string) => {
    setAvatarUrl(nextAvatar);
    window.localStorage.setItem(AVATAR_STORAGE_KEY, nextAvatar);
  };

  const handleAuthenticated = (nextSession: AuthResponse) => {
    setSession(nextSession);
    setAppView("home");
  };

  const handleLogout = async () => {
    await logoutAccount();
    setSession(null);
    setAuthView("login");
    setAppView("home");
  };

  if (isCheckingSession) {
    return (
      <main className="app-loading">
        <section className="loading-card">
          <p className="brand-tag">NOCTURNE</p>
          <div className="loading-bar" aria-hidden="true" />
        </section>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="auth-card">
        <LineWaves
          className="line-waves-bg"
          speed={0.26}
          brightness={0.26}
          color1="#ffffff"
          color2="#ffffff"
          color3="#ffffff"
          enableMouseInteraction
          mouseInfluence={1.35}
        />
        {authView === "login" ? (
          <LoginPage
            onAuthenticated={handleAuthenticated}
            onShowRegister={() => setAuthView("register")}
          />
        ) : (
          <RegisterPage
            onAuthenticated={handleAuthenticated}
            onShowLogin={() => setAuthView("login")}
          />
        )}
      </main>
    );
  }

  let content: ReactNode = <HomePage />;

  if (appView === "products") {
    content = <ProductsPage />;
  }

  if (appView === "purchase") {
    content = (
      <PurchasePage
        onSelectPlan={(plan) => {
          setSelectedPlan(plan);
          setAppView("plan");
        }}
      />
    );
  }

  if (appView === "plan") {
    content = <PlanPage plan={selectedPlan} />;
  }

  if (appView === "settings") {
    content = (
      <SettingsPage
        auth={session}
        avatarUrl={avatarUrl}
        onAvatarChange={handleAvatarChange}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <main className="dashboard-root">
      <LineWaves
        className="line-waves-bg"
        speed={0.26}
        brightness={0.26}
        color1="#ffffff"
        color2="#ffffff"
        color3="#ffffff"
        enableMouseInteraction
        mouseInfluence={1.35}
      />

      <Sidebar
        isCollapsed={isSidebarCollapsed}
        currentView={appView}
        avatarUrl={avatarUrl}
        onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
        onNavigate={setAppView}
        onOpenSettings={() => setAppView("settings")}
      />

      <section className="dashboard-content-wrap">
        <section className="dashboard-content">{content}</section>
      </section>
    </main>
  );
}
