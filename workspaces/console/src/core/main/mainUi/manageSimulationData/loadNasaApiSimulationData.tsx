import { VerticalLayout } from "../../../unit/package/PrimitiveUix/main";
import { SimpleButton } from "../../components/simpleButton";

export const LoadNasaApiSimulationData = () => {
  return (
    <VerticalLayout forceExpandChildHeight={false} spacing={10}>
      <SimpleButton text="Load" />
    </VerticalLayout>
  );
};
