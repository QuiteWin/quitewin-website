import { TrustModeToggle } from "./TrustMode";
import { SilenceModeToggle } from "./SilenceMode";
import { ObserverModeToggle } from "./ObserverMode";

const ModeBar = () => {
  return (
    <div className="fixed top-20 left-4 md:top-6 md:left-1/2 md:-translate-x-1/2 z-40 flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6">
      <TrustModeToggle className="whitespace-nowrap" />
      <SilenceModeToggle className="whitespace-nowrap" />
      <ObserverModeToggle className="whitespace-nowrap" />
    </div>
  );
};

export default ModeBar;
