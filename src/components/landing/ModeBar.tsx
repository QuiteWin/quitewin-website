import { TrustModeToggle } from "./TrustMode";
import { SilenceModeToggle } from "./SilenceMode";
import { ObserverModeToggle } from "./ObserverMode";

const ModeBar = () => {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6">
      <TrustModeToggle className="whitespace-nowrap" />
      <SilenceModeToggle className="whitespace-nowrap" />
      <ObserverModeToggle className="whitespace-nowrap" />
    </div>
  );
};

export default ModeBar;
