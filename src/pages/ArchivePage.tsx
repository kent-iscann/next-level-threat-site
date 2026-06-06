import './ArchivePage.css';
import { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, ArrowUpRight, FileText, Headphones, Presentation } from 'lucide-react';
import { fetchWatchManifest, parseDateStr } from '../utils/archive';
import { Gauge } from '../components/Gauge';

// ─── Types ───
type ContentItem = {
  id: number;
  type: string;
  title: string;
  description: string;
  date: string;
  source: string;
  prediction?: string;
  targetDate?: string;
  probability?: string;
};

type TopicEntry = {
  slug: string;
  title: string;
  publishDate: string;
  content: ContentItem[];
};

// ─── Content Card ───
function ContentIcon({ type }: { type: string }) {
  switch (type) {
    case 'pdf':
    case 'report':
      return <FileText className="archive-content-icon icon-pdf" />;
    case 'audio':
      return <Headphones className="archive-content-icon icon-audio" />;
    case 'presentation':
      return <Presentation className="archive-content-icon icon-presentation" />;
    default:
      return <FileText className="archive-content-icon icon-pdf" />;
  }
}

function ContentCard({ item }: { item: ContentItem }) {
  return (
    <div className="archive-content-card">
      <div className={`archive-content-card__icon archive-content-card__icon--${item.type}`}>
        <ContentIcon type={item.type} />
      </div>
      <div className="archive-content-card__body">
        <div className="archive-content-card__meta">
          {/* <span className={`archive-content-card__badge badge-${item.type}`}>
            {item.type?.toUpperCase() || 'REPORT'}
          </span> */}
          {/* <span className="archive-content-card__date">{item.date}</span> */}
        </div>
        <h3>{item.date}</h3>
        {item.description && <p>{item.description}</p>}
      </div>
      <div className="archive-content-card__action">
        {item.type === 'presentation' || item.type === 'report' ? (
          item.source ? (
            <a href={item.source} className="archive-content-card__cta" target="_blank" rel="noopener noreferrer">
              Read <ArrowUpRight className="cta-arrow" />
            </a>
          ) : (
            <span className="archive-content-card__cta cta-disabled" title="Content not yet available">
              Coming Soon
            </span>
          )
        ) : item.source ? (
          <span className="archive-content-card__cta cta-play">
            <audio controls>
              <source src={item.source} type="audio/mpeg" />
              Your browser does not support the audio tag.
            </audio>
          </span>
        ) : (
          <span className="archive-content-card__cta cta-disabled" title="Content not yet available">
            Coming Soon
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Row Renderer ───
type PredictionGroup = {
  prediction: string;
  targetDate?: string;
  probability?: string;
  latestDate?: string;
};

function summarizePredictions(content: ContentItem[]): PredictionGroup[] {
  const groups = new Map<string, PredictionGroup>();

  content.forEach((item) => {
    const prediction = item.prediction?.trim() || 'Unknown';
    if (!groups.has(prediction)) {
      groups.set(prediction, {
        prediction,
        targetDate: item.targetDate,
        probability: item.probability,
        latestDate: item.date,
      });
      return;
    }

    const existing = groups.get(prediction)!;
    const currentDate = item.date ? parseDateStr(item.date) : 0;
    const existingDate = existing.latestDate ? parseDateStr(existing.latestDate) : 0;
    if (currentDate > existingDate) {
      existing.latestDate = item.date;
      existing.targetDate = item.targetDate;
      existing.probability = item.probability;
    }
  });

  return Array.from(groups.values());
}

function PredictionCard({ group }: { group: PredictionGroup }) {
  const score = Math.round(Math.max(0, Math.min(100, parseFloat(group.probability || '0') || 0)));

  return (
    <div className="archive-content-card archive-prediction-card">
      <div className="archive-content-card__body archive-prediction-card__body">
        <p>{group.prediction}</p>
        <div className="archive-prediction-details">
          {group.targetDate && <p><strong>TARGET:</strong> {group.targetDate}</p>}
        </div>
      </div>
      <div className="archive-prediction-card__gauge">
        <Gauge score={score} />
      </div>
    </div>
  );
}

function ArchiveRow({
  entry,
  expanded,
  onToggle,
}: {
  entry: TopicEntry;
  expanded: boolean;
  onToggle: () => void;
}) {
  const predictionGroups = summarizePredictions(entry.content);

  return (
    <>
      <tr
        className={`archive-table__row ${expanded ? 'archive-table__row--expanded' : ''}`}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        aria-expanded={expanded}
      >
        <td className="archive-table__cell archive-table__cell--title">
          <span className="archive-table__title-text" title={entry.title}>
            {entry.title}
          </span>
        </td>
        <td className="archive-table__cell archive-table__cell--date">{entry.publishDate}</td>
        <td className="archive-table__cell archive-table__cell--expand">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </td>
      </tr>
      {expanded && (
        <tr className="archive-table__expanded-row">
          <td colSpan={3}>
            <div className="archive-expanded-content">
              {predictionGroups.length > 0 && (
                <div className="archive-content-section">
                  <h4>Predictions ({predictionGroups.length})</h4>
                  <div className="archive-expanded__content-grid">
                    {predictionGroups.map((group) => (
                      <PredictionCard key={group.prediction} group={group} />
                    ))}
                  </div>
                </div>
              )}
              <div className="archive-content-section">
                <h4>Reports ({entry.content.length})</h4>
                {entry.content.length > 0 ? (
                  <div className="archive-expanded__content-grid">
                    {entry.content.map((item) => (
                      <ContentCard key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <p className="archive-no-content">No reports are available for this topic.</p>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Empty State ───
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="archive-empty">
      <Search size={40} />
      <h3>No matching topics</h3>
      <p>Try adjusting your search or refresh the page.</p>
      <button className="btn btn-secondary" onClick={onClear}>Clear Search</button>
    </div>
  );
}

// ─── Main Page ───
export default function ArchivePage() {
  const [allEntries, setAllEntries] = useState<TopicEntry[]>([]);
  const [manifestLoading, setManifestLoading] = useState(false);
  const [manifestError, setManifestError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'publishDate' | 'title'>('publishDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const MANIFEST_URL = 'https://pub-70e08d62c8314675b40c42f0fe4be6fb.r2.dev/watch-reports/manifest.json';

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setManifestLoading(true);
      setManifestError(null);

      try {
        let topics = [];
        try {
          topics = await fetchWatchManifest(MANIFEST_URL);
        } catch (err) {
          try {
            topics = await fetchWatchManifest('/api/manifest');
          } catch (err2) {
            throw err2 || err;
          }
        }

        if (cancelled) return;

        const entries: TopicEntry[] = topics.map((t) => {
          const content = (t.reports || []).map((r, i) => ({
            id: i,
            type: r.type || 'report',
            title: r.title,
            description: r.description || '',
            date: r.date || '',
            source: r.url || '',
            prediction: r.prediction,
            targetDate: r.targetDate,
            probability: r.probability,
          }));

          const latestMs = (t.reports || []).reduce((acc, r) => Math.max(acc, parseDateStr(r.date)), 0);
          const publishDate = latestMs ? new Date(latestMs).toISOString().slice(0, 10) : '';

          return {
            slug: t.slug,
            title: t.topicName,
            publishDate,
            content,
          };
        });

        entries.sort((a, b) => {
          if (!a.publishDate) return 1;
          if (!b.publishDate) return -1;
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        });

        setAllEntries(entries);
      } catch (err: any) {
        setManifestError(err?.message || String(err));
      } finally {
        setManifestLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredEntries = useMemo(() => {
    let results = [...allEntries];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter((entry) => {
        const topicMatch = entry.title.toLowerCase().includes(q);
        const reportMatch = entry.content.some((item) =>
          [item.title, item.description].join(' ').toLowerCase().includes(q)
        );
        return topicMatch || reportMatch;
      });
    }

    results.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'publishDate') {
        cmp = new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
      } else {
        cmp = a.title.localeCompare(b.title);
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });

    return results;
  }, [allEntries, searchQuery, sortBy, sortDir]);

  const clearAll = () => {
    setSearchQuery('');
    setExpandedSlug(null);
  };

  const showClear = searchQuery.length > 0;

  return (
    <div className="container">
      <div className="archive-page">
        <header className="archive-header">
          <h1>Watch Report Archive</h1>
          <p>A complete catalog of our free content.</p>
        </header>

        {manifestLoading && (
          <div className="archive-manifest-status">Loading remote manifest…</div>
        )}
        {manifestError && (
          <div className="archive-manifest-status archive-manifest-status--error">Error loading manifest: {manifestError}</div>
        )}

        <div className="archive-controls">
          <div className="archive-controls__search">
            <Search size={18} className="archive-search-icon" />
            <input
              type="text"
              placeholder="Search by topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="archive-search-input"
            />
            {searchQuery && (
              <button className="archive-search-clear" onClick={() => setSearchQuery('')}>
                ✕
              </button>
            )}
          </div>

          <div className="archive-controls__filters">
            <select
              className="archive-controls__sort-select"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as 'publishDate' | 'title');
                setSortDir('desc');
              }}
            >
              <option value="publishDate">Sort: Latest Report</option>
              <option value="title">Sort: Topic</option>
            </select>
            <button
              className="archive-controls__sort"
              onClick={() => setSortDir(sortDir === 'desc' ? 'asc' : 'desc')}
              title={`Toggle sort direction (currently: ${sortDir === 'desc' ? 'descending' : 'ascending'})`}
            >
              {sortDir === 'desc' ? '↓' : '↑'}
            </button>
            {showClear && (
              <button className="archive-controls__clear" onClick={clearAll}>
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="archive-results-info">
          <span>
            Showing <strong>{filteredEntries.length}</strong> of <strong>{allEntries.length}</strong> topics
          </span>
        </div>

        {filteredEntries.length > 0 ? (
          <div className="archive-table-wrapper">
            <table className="archive-table">
              <thead>
                <tr>
                  <th className="archive-table__head">Topic</th>
                  <th className="archive-table__head">Latest Report</th>
                  <th className="archive-table__head archive-table__head--expand"></th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => (
                  <ArchiveRow
                    key={entry.slug}
                    entry={entry}
                    expanded={expandedSlug === entry.slug}
                    onToggle={() => setExpandedSlug(expandedSlug === entry.slug ? null : entry.slug)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState onClear={clearAll} />
        )}
      </div>
    </div>
  );
}
