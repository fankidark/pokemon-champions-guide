// Pokemon sprite URL generators

export const SPRITE_URLS = {
  /** High-quality official artwork (detail pages) */
  artwork: (id: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,

  /** Animated sprites from Showdown (list/selector) */
  animated: (name: string) =>
    `https://play.pokemonshowdown.com/sprites/ani/${name.toLowerCase().replace(/[^a-z0-9-]/g, "")}.gif`,

  /** Static front sprite (fallback) */
  front: (id: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,

  /** Mini icons for team strips */
  icon: (id: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${id}.png`,

  /** Local cached sprite (after build-time download) */
  local: (id: number) => `/sprites/${id}.webp`,
};

/** Get best available sprite URL */
export function getPokemonSprite(id: number, size: "icon" | "thumb" | "full" = "thumb"): string {
  switch (size) {
    case "icon":
      return SPRITE_URLS.icon(id);
    case "thumb":
      return SPRITE_URLS.front(id);
    case "full":
      return SPRITE_URLS.artwork(id);
  }
}
