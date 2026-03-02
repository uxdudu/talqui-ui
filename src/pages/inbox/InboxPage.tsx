import { useState, useMemo } from "react";
import { Sidebar } from "../../components/layout/Sidebar";
import type { SidebarNavId } from "../../components/layout/Sidebar";
import { InboxTabs, ConversationEmptyState, SetupPanel, ConversationList, ConversationChatPanel, ConversationSidebar } from "./components";
import type { InboxTabId } from "./components/InboxTabs";
import { SETUP_STEPS, MOCK_CONVERSATIONS } from "./data";
import { EXTENSIONS } from "../extensoes/data";

interface InboxPageProps {
  activeNav?: SidebarNavId;
  onNavTo?: (id: SidebarNavId) => void;
}

export function InboxPage({ activeNav = "mensagens", onNavTo }: InboxPageProps) {
  const [activeTab, setActiveTab] = useState<InboxTabId>("fila");
  const [setupSteps] = useState(SETUP_STEPS);
  const [extensions] = useState(EXTENSIONS);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const conversationsByTab = useMemo(() => {
    return MOCK_CONVERSATIONS.filter((c) => c.status === activeTab);
  }, [activeTab]);

  const selectedConversation = useMemo(() => {
    if (!selectedConversationId) return null;
    return MOCK_CONVERSATIONS.find((c) => c.id === selectedConversationId) ?? null;
  }, [selectedConversationId]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-(--talqui-bg-weaker) p-1">
      <Sidebar
        activeNav={activeNav}
        onNavClick={onNavTo}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-(--talqui-radius-xl)">
        <div className="flex min-h-0 min-w-0 flex-1 w-full flex-row overflow-hidden bg-white">
          {/* Painel esquerdo: lista de conversas */}
          <div className="flex min-h-0 w-[400px] shrink-0 flex-col border-r border-(--talqui-border-weak)">
            <InboxTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <ConversationList
              conversations={conversationsByTab}
              selectedId={selectedConversationId}
              onSelectConversation={setSelectedConversationId}
              emptyComponent={
                <ConversationEmptyState onNewConversation={() => {}} />
              }
            />
          </div>
          {/* Centro: chat da conversa selecionada ou setup */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            {selectedConversation ? (
              <div className="flex min-h-0 min-w-0 flex-1 flex-row overflow-hidden">
                <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                  <ConversationChatPanel
                    conversation={selectedConversation}
                    onBack={() => setSelectedConversationId(null)}
                  />
                </div>
                <ConversationSidebar
                  conversation={selectedConversation}
                  extensions={extensions}
                  onStartService={() => {}}
                  onUseExtension={(id) => console.log("Usar extensão", id)}
                />
              </div>
            ) : (
              <SetupPanel
                steps={setupSteps}
                onConfigure={(id) => console.log("Configurar", id)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
