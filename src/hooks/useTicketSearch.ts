import { useMemo } from 'react';
import Fuse from 'fuse.js';
import { Ticket } from '@/lib/domain/entities';

const fuseOptions = {
  keys: ['title', 'description', 'id', 'tags'],
  threshold: 0.3, // Fuzzy match sensitivity
  ignoreLocation: true,
};

export function useTicketSearch(tickets: Ticket[], query: string) {
  const fuse = useMemo(() => new Fuse(tickets, fuseOptions), [tickets]);

  const results = useMemo(() => {
    if (!query) return tickets;
    return fuse.search(query).map(result => result.item);
  }, [fuse, query, tickets]);

  return results;
}
