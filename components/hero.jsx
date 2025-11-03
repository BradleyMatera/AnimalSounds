"use client";

import { Button, Card, CardBody, Chip } from "@nextui-org/react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-divider bg-gradient-to-r from-secondary/20 via-primary/10 to-secondary/20 px-8 py-12 shadow-lg">
      <div className="absolute inset-0 -z-10 bg-dot-slate-200 dark:bg-dot-slate-700" aria-hidden="true" />
      <div className="grid gap-8 md:grid-cols-[1.25fr_1fr] md:items-center">
        <div className="space-y-6">
          <Chip color="secondary" variant="flat" size="sm" className="bg-secondary/20" startContent={<span>✨</span>}>
            Built with Next.js, Bun, and NextUI
          </Chip>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Explore the soundscape of the animal kingdom
          </h1>
          <p className="text-base text-foreground/70 md:text-lg">
            Discover hand-curated animal calls, rhythm-driven stories, and rich natural imagery. Streamlined
            performance, tactile interactions, and adaptive theming deliver a sensory experience across devices.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button as={Link} href="#collection" color="secondary" size="lg">
              Browse collection
            </Button>
            <Button as={Link} href="#about" variant="flat" size="lg">
              Learn about the project
            </Button>
          </div>
        </div>

        <Card shadow="none" className="border border-divider bg-background/70">
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wide text-default-500">Performance snapshot</span>
              <span className="text-xs text-default-400">Realtime metrics</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-xl bg-default-100/70 px-3 py-4 dark:bg-default-50/30">
                <p className="text-3xl font-semibold">45K</p>
                <p className="text-xs uppercase tracking-wide text-default-400">Plays</p>
              </div>
              <div className="rounded-xl bg-default-100/70 px-3 py-4 dark:bg-default-50/30">
                <p className="text-3xl font-semibold">320</p>
                <p className="text-xs uppercase tracking-wide text-default-400">Favorites</p>
              </div>
              <div className="rounded-xl bg-default-100/70 px-3 py-4 dark:bg-default-50/30">
                <p className="text-3xl font-semibold">98%</p>
                <p className="text-xs uppercase tracking-wide text-default-400">Satisfaction</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-default-500">
              Engineered as a progressive experience with offline-ready audio, resilient image caching, and adaptive
              color systems.
            </p>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
