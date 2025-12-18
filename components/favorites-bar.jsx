"use client";

import { Avatar, AvatarGroup, Button, Card, CardBody } from "@nextui-org/react";
import { withBasePath } from "@/lib/base-path";

export default function FavoritesBar({ favorites, onClear }) {
  if (!favorites.length) {
    return null;
  }

  return (
    <Card shadow="none" className="border border-divider bg-background/70">
      <CardBody className="flex flex-wrap items-center gap-4">
        <div>
          <p className="text-sm font-medium text-foreground">Favorites</p>
          <p className="text-xs text-default-500">
            Quickly access your most-loved animal sounds.
          </p>
        </div>
        <AvatarGroup max={6} size="sm">
          {favorites.map((animal) => (
            <Avatar
              key={animal.id}
              name={animal.name}
              src={withBasePath(animal.fallbackImage)}
              radius="md"
            />
          ))}
        </AvatarGroup>
        <Button variant="flat" color="danger" size="sm" onPress={onClear} className="ml-auto">
          Clear favorites
        </Button>
      </CardBody>
    </Card>
  );
}
