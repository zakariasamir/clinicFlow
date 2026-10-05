import React from "react";
import { Paper, Text, Group } from "@mantine/core";

export interface MetricKpiCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  subtitle?: string;
  colorClass?: string;
  bgIconClass?: string;
}

export function MetricKpiCard({
  title,
  value,
  icon,
  subtitle,
  colorClass = "text-teal-600",
  bgIconClass = "bg-teal-50 text-teal-600",
}: MetricKpiCardProps) {
  return (
    <Paper withBorder p="md" radius="lg" className="bg-white hover:shadow-xs transition-shadow">
      <Group justify="space-between" align="flex-start">
        <div>
          <Text size="xs" c="dimmed" fw={600} className="uppercase tracking-wider">
            {title}
          </Text>
          <Text fw={700} className="text-2xl mt-1 text-slate-900">
            {value}
          </Text>
          {subtitle && (
            <Text size="xs" c="dimmed" className="mt-1">
              {subtitle}
            </Text>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bgIconClass}`}>
          {icon}
        </div>
      </Group>
    </Paper>
  );
}

export default MetricKpiCard;
