import type { Connection } from "../../data";
import { getExtensionLogo } from "../../../../lib/brand-icons";
import { Icons } from "../../../../components/icons";
import { Button } from "../../../../components/ui/Button";
import { InstagramSettingsContent } from "./InstagramSettingsContent";
import { LugaresSettingsContent } from "./LugaresSettingsContent";
import { CalendlySettingsContent } from "./CalendlySettingsContent";
import { IFoodSettingsContent } from "./iFoodSettingsContent";
import { GenericSettingsContent } from "./GenericSettingsContent";
import type { ConnectionSettingsContentProps } from "./types";

const SETTINGS_MAP: Record<
  string,
  (props: ConnectionSettingsContentProps) => JSX.Element
> = {
  instagram: InstagramSettingsContent,
  lugares: LugaresSettingsContent,
  calendly: CalendlySettingsContent,
  ifood: IFoodSettingsContent,
};

export function getConnectionSettingsContent(
  extensionId: string
): (props: ConnectionSettingsContentProps) => JSX.Element {
  return SETTINGS_MAP[extensionId] ?? GenericSettingsContent;
}

export function ConnectionSettingsRouter(props: ConnectionSettingsContentProps) {
  const Content = getConnectionSettingsContent(props.extension.id);
  return <Content {...props} />;
}
