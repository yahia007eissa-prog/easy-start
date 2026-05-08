import fs   from 'fs';
import path  from 'path';
import { v4 as uuid } from 'uuid';

export interface TrustedWebsite {
  id:          string;
  name:        string;
  url:         string;
  category:    string;
  description: string;
  notes:       string;
  addedAt:     string;
}

const CONFIG_PATH = path.join(process.cwd(), 'lib', 'ai', 'websites-config.json');

let cache: TrustedWebsite[] | null = null;

function load(): TrustedWebsite[] {
  if (cache) return cache;
  if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify([], null, 2), 'utf-8');
    cache = [];
    return cache;
  }
  try {
    cache = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8')) as TrustedWebsite[];
  } catch {
    cache = [];
  }
  return cache;
}

function save(list: TrustedWebsite[]) {
  cache = list;
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(list, null, 2), 'utf-8');
}

export function getWebsites(): TrustedWebsite[] {
  return load();
}

export function addWebsite(data: Omit<TrustedWebsite, 'id' | 'addedAt'>): TrustedWebsite {
  const list = load();
  const item: TrustedWebsite = { ...data, id: uuid(), addedAt: new Date().toISOString() };
  list.push(item);
  save(list);
  return item;
}

export function updateWebsite(id: string, data: Partial<Omit<TrustedWebsite, 'id' | 'addedAt'>>): TrustedWebsite | null {
  const list = load();
  const idx  = list.findIndex(w => w.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...data };
  save(list);
  return list[idx];
}

export function deleteWebsite(id: string): boolean {
  const list = load();
  const next = list.filter(w => w.id !== id);
  if (next.length === list.length) return false;
  save(next);
  return true;
}
