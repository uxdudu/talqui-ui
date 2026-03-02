import type { Extension } from "../data";
import { Icons } from "../../../components/icons";
import { ExtensionDetailsContent } from "./ExtensionDetailsContent";

interface ExtensionDetailsModalProps {
  extension: Extension;
  onClose: () => void;
  onInstall: (id: string) => void;
}

export function ExtensionDetailsModal({
  extension,
  onClose,
  onInstall,
}: ExtensionDetailsModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="extension-details-title"
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-[var(--talqui-main-max-w)] flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 text-[var(--talqui-text-medium)] shadow-sm hover:bg-white hover:text-[var(--talqui-text-strong)]"
          aria-label="Fechar"
        >
          <Icons.Close size={24} />
        </button>
        <div className="overflow-auto">
          <ExtensionDetailsContent
            extension={extension}
            variant="modal"
            onInstall={onInstall}
          />
        </div>
      </div>
    </div>
  );
}
