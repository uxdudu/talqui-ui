import type { ReactElement } from "react";
import { InstagramSettingsContent } from "./InstagramSettingsContent";
import { LugaresSettingsContent } from "./LugaresSettingsContent";
import { CalendlySettingsContent } from "./CalendlySettingsContent";
import { IFoodSettingsContent } from "./iFoodSettingsContent";
import { GenericSettingsContent } from "./GenericSettingsContent";
import type { ConnectionSettingsContentProps } from "./types";

const SETTINGS_MAP: Record<
  string,
  (props: ConnectionSettingsContentProps) => ReactElement
> = {
  instagram: InstagramSettingsContent,
  lugares: LugaresSettingsContent,
  calendly: CalendlySettingsContent,
  ifood: IFoodSettingsContent,
};

export function getConnectionSettingsContent(
  extensionId: string
): (props: ConnectionSettingsContentProps) => ReactElement {
  return SETTINGS_MAP[extensionId] ?? GenericSettingsContent;
}

export function ConnectionSettingsRouter(props: ConnectionSettingsContentProps) {
  const Content = getConnectionSettingsContent(props.extension.id);
  return <Content {...props} />;
}
