import React from "react";
import { Badge } from "@mantine/core";
import { AppointmentStatus } from "@/router/types";

export interface StatusBadgeProps {
  status: AppointmentStatus;
  size?: "xs" | "sm" | "md" | "lg";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  switch (status) {
    case "CONFIRMED":
      return (
        <Badge
          color="teal"
          variant="light"
          size={size}
          className="font-semibold capitalize tracking-wide"
        >
          Confirmé
        </Badge>
      );
    case "PENDING":
      return (
        <Badge
          color="yellow"
          variant="light"
          size={size}
          className="font-semibold capitalize tracking-wide"
        >
          En attente
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge
          color="red"
          variant="light"
          size={size}
          className="font-semibold capitalize tracking-wide"
        >
          Annulé
        </Badge>
      );
    default:
      return (
        <Badge color="gray" variant="light" size={size}>
          {status}
        </Badge>
      );
  }
}

export default StatusBadge;
