import {FillAndCenter} from "../layout/FillAndCenter";
import CircularProgress from "@mui/material/CircularProgress";

export function InProgressPlaceholder() {
  return (
    <FillAndCenter>
      <CircularProgress />
    </FillAndCenter>
  );
}
