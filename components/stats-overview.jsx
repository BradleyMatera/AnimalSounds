"use client";

import { Card, CardHeader, CardBody } from "@nextui-org/react";

const STAT_LAYOUT = [
  { key: "totalSessions", label: "Sessions", accent: "text-secondary" },
  { key: "totalInteractions", label: "Sounds played", accent: "text-primary" },
  { key: "favoriteCount", label: "Favorites", accent: "text-success" }
];

export default function StatsOverview({ stats }) {
  return (
    <Card shadow="none" className="border border-divider bg-background/60">
      <CardHeader className="flex flex-col gap-1">
        <span className="text-sm font-medium uppercase tracking-wide text-default-500">Your activity</span>
        <h3 className="text-xl font-semibold text-foreground">Personal listening stats</h3>
      </CardHeader>
      <CardBody>
        <dl className="grid gap-4 sm:grid-cols-3">
          {STAT_LAYOUT.map((item) => (
            <div key={item.key} className="rounded-2xl bg-default-100/60 p-4 dark:bg-default-50/10">
              <dt className="text-xs uppercase tracking-wide text-default-400">{item.label}</dt>
              <dd className={`text-3xl font-semibold ${item.accent}`}>
                {stats[item.key] ?? 0}
              </dd>
            </div>
          ))}
        </dl>
        {stats.lastPlayed ? (
          <p className="mt-4 text-sm text-default-500">
            Last played sound: <span className="font-semibold text-default-600">{stats.lastPlayed}</span>
          </p>
        ) : (
          <p className="mt-4 text-sm text-default-500">
            Press play on any card to start building your personal history.
          </p>
        )}
      </CardBody>
    </Card>
  );
}
