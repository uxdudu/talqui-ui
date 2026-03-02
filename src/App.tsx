import { useState } from "react";
import { ExtensoesPage } from "./pages/extensoes/ExtensoesPage";
import { InboxPage } from "./pages/inbox/InboxPage";
import { ProcedimentosPage } from "./pages/procedimentos/ProcedimentosPage";
import { EstatisticasPage } from "./pages/estatisticas/EstatisticasPage";
import type { SidebarNavId } from "./components/layout/Sidebar";

function App() {
  const [currentPage, setCurrentPage] = useState<"inbox" | "extensoes" | "procedimentos" | "estatisticas">("procedimentos");
  const [sidebarActive, setSidebarActive] = useState<SidebarNavId>("procedimentos");

  const handleNav = (id: SidebarNavId) => {
    setSidebarActive(id);
    if (id === "mensagens") setCurrentPage("inbox");
    if (id === "relatorios") setCurrentPage("estatisticas");
    if (id === "extensoes") setCurrentPage("extensoes");
    if (id === "procedimentos") setCurrentPage("procedimentos");
  };

  if (currentPage === "inbox") return <InboxPage activeNav={sidebarActive} onNavTo={handleNav} />;
  if (currentPage === "extensoes") return <ExtensoesPage activeNav={sidebarActive} onNavTo={handleNav} />;
  if (currentPage === "estatisticas") return <EstatisticasPage activeNav={sidebarActive} onNavTo={handleNav} />;
  if (currentPage === "procedimentos") return <ProcedimentosPage activeNav={sidebarActive} onNavTo={handleNav} />;
  return <ProcedimentosPage activeNav={sidebarActive} onNavTo={handleNav} />;
}

export default App;
