import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useMainContext } from "../../../hooks/useMainContext";

export const ModelLoadingFallback = observer(({ id }: { id: string }) => {
  const { uiManager } = useMainContext();

  useEffect(() => {
    uiManager.add3DLoadingItem(id);
    return () => {
      uiManager.remove3DLoadingItem(id);
    };
  }, [id, uiManager]);

  return null;
});