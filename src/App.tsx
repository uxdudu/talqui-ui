import { useState } from "react";
import { ExtensoesPage } from "./pages/extensoes/ExtensoesPage";
import { InboxPage } from "./pages/inbox/InboxPage";
import { ProcedimentosPage } from "./pages/procedimentos/ProcedimentosPage";
import type { SidebarNavId } from "./components/layout/Sidebar";

function App() {
  const [currentPage, setCurrentPage] = useState<"inbox" | "extensoes" | "procedimentos">("procedimentos");
  const [sidebarActive, setSidebarActive] = useState<SidebarNavId>("procedimentos");

  const handleNav = (id: SidebarNavId) => {
    setSidebarActive(id);
    if (id === "mensagens") setCurrentPage("inbox");
    if (id === "envio" || id === "agenda" || id === "relatorios") setCurrentPage("inbox"); // placeholder até ter páginas
    if (id === "extensoes") setCurrentPage("extensoes");
    if (id === "procedimentos") setCurrentPage("procedimentos");
  };

  if (currentPage === "inbox") return <InboxPage activeNav={sidebarActive} onNavTo={handleNav} />;
  if (currentPage === "extensoes") return <ExtensoesPage activeNav={sidebarActive} onNavTo={handleNav} />;
  if (currentPage === "procedimentos") return <ProcedimentosPage activeNav={sidebarActive} onNavTo={handleNav} />;
  return <ProcedimentosPage activeNav={sidebarActive} onNavTo={handleNav} />;
}

export default App;
