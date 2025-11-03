"use client";

import { useMemo } from "react";
import Image from "next/image";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Chip,
  Tooltip
} from "@nextui-org/react";

function formatHabitat(habitat) {
  return habitat.split(",").map((part) => part.trim());
}

export default function SoundCard({
  animal,
  isPlaying,
  isFavorite,
  onPlay,
  onToggleFavorite,
  image
}) {
  const habitats = useMemo(() => formatHabitat(animal.habitat), [animal.habitat]);

  return (
    <Card shadow="sm" className="group relative overflow-hidden border border-divider" role="article">
      <CardHeader className="relative flex items-start gap-4 border-b border-divider">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/20 text-3xl">
          <span role="img" aria-hidden="true">
            {animal.emoji}
          </span>
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-foreground">{animal.name}</h2>
          <p className="text-small text-default-500 italic">{animal.scientificName}</p>
        </div>
        <Tooltip content={isFavorite ? "Remove from favorites" : "Add to favorites"} placement="top">
          <Button
            isIconOnly
            radius="full"
            variant={isFavorite ? "solid" : "flat"}
            color="secondary"
            className="ml-auto"
            onPress={() => onToggleFavorite(animal.id)}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? `Remove ${animal.name} from favorites` : `Save ${animal.name} to favorites`}
          >
            {isFavorite ? "★" : "☆"}
          </Button>
        </Tooltip>
      </CardHeader>

      <CardBody className="flex flex-col gap-5">
        <div className="relative overflow-hidden rounded-2xl">
          <div className={`absolute inset-0 bg-gradient-to-br ${animal.accent}`} aria-hidden="true" />
          <Image
            src={image?.url || animal.fallbackImage}
            alt={image?.alt || `${animal.name} illustration`}
            width={640}
            height={360}
            className="h-56 w-full object-cover"
            priority={animal.id === "lion"}
            unoptimized={!image?.url}
          />
          <div className="absolute inset-x-0 bottom-0 flex justify-between p-4 text-sm text-white/90">
            <span>{image?.photographer || "Animal Sounds Team"}</span>
            {image?.photographerUrl ? (
              <a
                href={image.photographerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                View source
              </a>
            ) : null}
          </div>
        </div>

        <p className="text-small leading-relaxed text-default-600 dark:text-default-500">
          {animal.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {habitats.map((habitat) => (
            <Chip key={habitat} size="sm" variant="flat" color="primary" className="bg-primary/10 text-primary">
              {habitat}
            </Chip>
          ))}
          <Chip size="sm" variant="flat" color="warning" className="bg-warning/10 text-warning">
            {animal.continent}
          </Chip>
        </div>
      </CardBody>

      <CardFooter className="flex flex-col gap-3 border-t border-divider">
        <Button
          color={isPlaying ? "danger" : "secondary"}
          variant={isPlaying ? "flat" : "solid"}
          onPress={() => onPlay(animal)}
          fullWidth
          aria-pressed={isPlaying}
        >
          {isPlaying ? "Stop sound" : "Play sound"}
        </Button>
      </CardFooter>
    </Card>
  );
}
