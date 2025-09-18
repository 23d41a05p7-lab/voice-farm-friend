import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/auth/AuthModal";
import { useState } from "react";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading Smart Crop Advisor...</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index user={user} onShowAuth={() => setShowAuthModal(true)} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
