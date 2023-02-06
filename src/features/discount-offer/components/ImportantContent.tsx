import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {grey} from "@mui/material/colors";

type Props = {
  title: string;
  content: string;
}

export function ImportantContent({title, content}: Props) {
  return (
    <Stack gap={2}>
      <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
        {title}
      </Typography>

      <Box
        sx={{
          bgcolor: grey[100],
          px: 2,
          py: 1,
          borderRadius: 1,
        }}
      >
        <Typography variant="body1" fontWeight="bold" fontSize={20} textAlign="center">
          {content}
        </Typography>
      </Box>
    </Stack>
  );
}
