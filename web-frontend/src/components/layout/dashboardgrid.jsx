import { Grid } from "@mui/material";

export function DashboardRow({
  children,
  spacing = 2,
  sx = {}
}) {
  return (
    <Grid
      container
      spacing={spacing}
      sx={{
        mt: 0,
        ...sx
      }}
    >
      {children}
    </Grid>
  );
}

export function DashboardColumn({
  children,
  xs = 12,
  sm,
  md,
  lg,
  xl,
  sx = {}
}) {
  return (
    <Grid
      item
      xs={xs}
      sm={sm}
      md={md}
      lg={lg}
      xl={xl}
      sx={sx}
    >
      {children}
    </Grid>
  );
}