import { GAMES_CATALOG } from '@/store/useAppStore';
import GamePlayerView from '@/app/game/[id]/GamePlayerView';

export function generateStaticParams() {
  return GAMES_CATALOG.map((g) => ({
    id: g.id,
  }));
}

export default async function GamesDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GamePlayerView id={id} />;
}
