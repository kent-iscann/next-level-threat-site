export type ReportItem = {
  id: string;
  title: string;
  description?: string;
  date?: string;
  url?: string;
  type?: string;
  prediction?: string;
  targetDate?: string;
  probability?: string;
};

export type Topic = {
  topicId: string;
  topicName: string;
  slug: string;
  reports: ReportItem[];
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function parseDateStr(d?: string): number {
  if (!d) return 0;
  const parsed = Date.parse(d);
  if (!isNaN(parsed)) return parsed;
  // try common alternate formats (DD/MM/YYYY or DD-MM-YYYY)
  const parts = d.split(/[\/\-]/).map((p) => p.trim());
  if (parts.length === 3) {
    // assume DD/MM/YYYY
    const [a, b, c] = parts;
    const iso = `${c}-${b.padStart(2, '0')}-${a.padStart(2, '0')}`;
    const p2 = Date.parse(iso);
    return isNaN(p2) ? 0 : p2;
  }
  return 0;
}

/**
 * Fetches a manifest (expected JSON) and returns grouped topics with reports.
 * The manifest shape may vary; this function attempts to be permissive.
 */
export async function fetchWatchManifest(url: string): Promise<Topic[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch manifest: ${res.status}`);
  const json = await res.json();

  // If manifest is an object with topics mapping
  if (json && typeof json === 'object' && !Array.isArray(json)) {
    // Try find a `topics` or `collections` property
    const candidates = ['topics', 'collections', 'groups', 'items'];
    for (const key of candidates) {
      if (Array.isArray((json as any)[key])) {
        return normalizeList((json as any)[key]);
      }
    }
  }

  // If manifest is an array of report records
  if (Array.isArray(json)) {
    // If each element already grouped by topic (has topicName + reports), normalize
    if (json.length > 0 && json[0].topicName && Array.isArray(json[0].reports)) {
      return (json as any).map((t: any) => ({
        topicId: t.slug || slugify(t.topic || 'topic'),
        topicName: t.topic,
        slug: t.slug || slugify(t.topic || 'topic'),
        reports: (t.reports || []).map(normalizeReport),
      }));
    }   

    // Otherwise assume flat list of reports with a topic field
    const byTopic = new Map<string, Topic>();
    (json as any[]).forEach((r) => {
      const topicName = r.topic || r.collection || r.series || r.topicName || 'Ungrouped';
      const key = String(topicName || 'Ungrouped');
      if (!byTopic.has(key)) {
        byTopic.set(key, { topicId: slugify(key), topicName: key, slug: slugify(key), reports: [] });
      }
      const t = byTopic.get(key)!;
      t.reports.push(normalizeReport(r));
    });
    return Array.from(byTopic.values());
  }

  // Fallback: empty
  return [];
}

function normalizeList(list: any[]): Topic[] {
  return list.map((t) => ({
    topicId: t.id || slugify(t.name || t.title || 'topic'),
    topicName: t.topic || t.title || t.topicName || 'Topic',
    slug: slugify(t.slug || t.name || t.title || t.topicName || 'topic'),
    reports: Array.isArray(t.reports) ? t.reports.map(normalizeReport) : (t.items || []).map(normalizeReport),
  }));
}

function normalizeReport(r: any): ReportItem {
  return {
    id: String(r.id || r.uid || r.url || r.link || r.title || Math.random()),
    title: r.title || r.name || r.caption || 'Untitled',
    description: r.description || r.summary || r.excerpt,
    date: r.date || r.published_at || r.published || r.publish_date,
    url: r.url || r.link || r.source,
    type: r.type || r.format,
    prediction: r.prediction || r.prediction_text || r.predictionText,
    targetDate: r.target_date || r.targetDate,
    probability: r.probability != null ? String(r.probability) : undefined,
  };
}

export { parseDateStr };
