import { QueryCache, QueryClient } from "@tanstack/react-query";
import { createRouteMask, createRouter } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { useAuthStore } from "@/store/auth-store";
import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "./styles.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "@/app.tsx";
import AuthProvider from "@/components/providers/auth-provider.tsx";
// import reportWebVitals from "./reportWebVitals.ts";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        console.error("Unrecoverable auth error detected. Logging out.");
        useAuthStore.getState().clearAuth();
      }
    },
  }),
});

const signinModalToSigninMask = createRouteMask({
  routeTree,
  from: "/signin/modal",
  to: "/signin",
  unmaskOnReload: true,
});

const signupModalToSignupMask = createRouteMask({
  routeTree,
  from: "/signup/modal",
  to: "/signup",
  unmaskOnReload: true,
});

// Create a new router instance

const TanStackQueryProviderContext = TanStackQueryProvider.getContext();
export const router = createRouter({
  routeTree,
  routeMasks: [signinModalToSigninMask, signupModalToSignupMask],
  context: {
    ...TanStackQueryProviderContext,
    // biome-ignore lint/style/noNonNullAssertion: <...>
    auth: undefined!,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <GoogleOAuthProvider clientId={googleClientId}>
        <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </TanStackQueryProvider.Provider>
      </GoogleOAuthProvider>
    </StrictMode>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
