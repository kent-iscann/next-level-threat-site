import './ArchivePage.css';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, ChevronDown, ChevronUp, ArrowUpRight, FileText, Headphones, Presentation } from 'lucide-react';

// ─── Types ───
type ContentItem = {
  id: number;
  type: string;
  title: string;
  description: string;
  date: string;
  source: string;
};

type ArchiveEntry = {
  type: 'signal-fracture' | 'nexus';
  slug: string;
  uid: string;
  title: string;
  description: string;
  publishDate: string;
  regions: string[];
  regionNames: string[];
  categories: string[];
  tags: string[];
  content: ContentItem[];
};

// ─── Data Loading ───
function loadArchiveEntries(): ArchiveEntry[] {
  const sfModules = import.meta.glob('/src/content/signal-fracture/*.json', { eager: true });
  const nexusModules = import.meta.glob('/src/content/nexus/*.json', { eager: true });

  const loadFiles = (modules: any, type: 'signal-fracture' | 'nexus'): ArchiveEntry[] => {
    return Object.entries(modules).map(([key, module]) => {
      const json = (module as any).default;
      const slug = key.split('/').pop()?.replace('.json', '') ?? '';

      // Collect all content arrays from the JSON
      const content: ContentItem[] = [];
      Object.keys(json).forEach((k) => {
        if (Array.isArray(json[k]) && k.endsWith('content')) {
          content.push(...json[k]);
        }
      });

      return {
        type,
        slug,
        uid: json.uid || `/${type}/${slug}`,
        title: json.title || slug,
        description: json.subtitle || '',
        publishDate: json.publish_date || '',
        regions: (json.regions || []).map((r: any) => r.id),
        regionNames: (json.regions || []).map((r: any) => r.name),
        categories: (json.categories || []).map((c: any) => c.name),
        tags: (json.tags || []).map((t: any) => t.name),
        content,
      };
    });
  };

  return [
    ...loadFiles(sfModules, 'signal-fracture'),
    ...loadFiles(nexusModules, 'nexus'),
  ];
}

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
          <span className={`archive-content-card__badge badge-${item.type}`}>
            {item.type.toUpperCase()}
          </span>
          <span className="archive-content-card__date">{item.date}</span>
        </div>
        <h3>{item.title}</h3>
        {/* <p>{item.description}</p> */}
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
        ) : (
          item.source ? (
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
          )
        )}
      </div>
    </div>
  );
}

// ─── Filter Dropdown ───
function FilterDropdown({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: { value: string; label: string; count: number }[];
  selected: string[];
  onChange: (selected: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((s) => s !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const activeCount = selected.length;

  return (
    <div className="archive-filter">
      <button
        className={`archive-filter__trigger ${activeCount > 0 ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {label}
        {activeCount > 0 && <span className="archive-filter__count">{activeCount}</span>}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && (
        <div className="archive-filter__menu">
          {options.map((opt) => (
            <label key={opt.value} className="archive-filter__option">
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => toggle(opt.value)}
              />
              <span className="archive-filter__label">{opt.label}</span>
              <span className="archive-filter__count-label">{opt.count}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Row Renderer ───
function ArchiveRow({
  entry,
  expanded,
  onToggle,
}: {
  entry: ArchiveEntry;
  expanded: boolean;
  onToggle: () => void;
}) {
  const typeLabel = entry.type === 'signal-fracture' ? 'Signal & Fracture' : 'Nexus';
  const typeClass = entry.type === 'signal-fracture' ? 'type-signal-fracture' : 'type-nexus';

  return (
    <>
      <tr
        className={`archive-table__row ${expanded ? 'archive-table__row--expanded' : ''} ${typeClass}`}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
        aria-expanded={expanded}
      >
        <td className="archive-table__cell archive-table__cell--title">
          <Link
            to={`/${entry.type}/${entry.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="archive-table__title-link"
            title={entry.title}
          >
            {entry.title}
          </Link>
          <span className={`archive-table__type-badge ${typeClass}`}>{typeLabel}</span>
        </td>
        {/* <td className="archive-table__cell archive-table__cell--desc" title={entry.description}>
          {entry.description.length > 80
            ? `${entry.description.slice(0, 80)}…`
            : entry.description}
        </td> */}
        <td className="archive-table__cell">
          {entry.regionNames.map((r) => (
            <span key={r} className="archive-table__tag">{r}</span>
          ))}
        </td>
        <td className="archive-table__cell archive-table__cell--date">{entry.publishDate}</td>
        {/* <td className="archive-table__cell">
          {entry.categories.map((c) => (
            <span key={c} className="archive-table__tag">{c}</span>
          ))}
        </td> */}
        {/* <td className="archive-table__cell">
          {entry.tags.map((t) => (
            <span key={t} className="archive-table__tag">{t}</span>
          ))}
        </td> */}
        <td className="archive-table__cell archive-table__cell--expand">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </td>
      </tr>
      {expanded && (
        <tr className="archive-table__expanded-row">
          <td colSpan={7}>
            <div className="archive-expanded-content">
              <div className="archive-expanded__header">
                {/* <h3>{entry.title}</h3> */}
                <p>
                  {entry.tags.map((t) => (
                    <span key={t} className="archive-table__tag">{t}</span>
                  ))}
                </p>
                <p className="archive-expanded__full-desc">{entry.description}</p>
                {/* <div className="archive-expanded__meta">
                  <span className={`archive-type-badge ${typeClass}`}>{typeLabel}</span>
                  <span>Published: {entry.publishDate}</span>
                  <span>Regions: {entry.regionNames.join(', ')}</span>
                  <span>Categories: {entry.categories.join(', ')}</span>
                  <span>Tags: {entry.tags.join(', ')}</span>
                </div> */}
                <Link to={`/${entry.type}/${entry.slug}`} className="archive-expanded__view-link">
                  View Full Analysis <ArrowUpRight size={14} />
                </Link>
              </div>
              <div className="archive-content-section">
                <h4>Content ({entry.content.length})</h4>
                {entry.content.length > 0 ? (
                  <div className="archive-expanded__content-grid">
                    {entry.content.map((item) => (
                      <ContentCard key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <p className="archive-no-content">No associated content yet.</p>
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
      <h3>No matching entries</h3>
      <p>Try adjusting your search or filters.</p>
      <button className="btn btn-secondary" onClick={onClear}>Clear All Filters</button>
    </div>
  );
}

// ─── Main Page ───
export default function ArchivePage() {
  const allEntries = useMemo(() => loadArchiveEntries(), []);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegions, setFilterRegions] = useState<string[]>([]);
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'signal-fracture' | 'nexus'>('all');
  const [sortBy, setSortBy] = useState<'publishDate' | 'title' | 'regions'>('publishDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  // Collect all unique filter options
  const allRegions = useMemo(() => {
    const map = new Map<string, { label: string; count: number }>();
    allEntries.forEach((e) => {
      e.regions.forEach((id, i) => {
        const existing = map.get(id);
        if (existing) existing.count += 1;
        else map.set(id, { label: e.regionNames[i], count: 1 });
      });
    });
    return Array.from(map).map(([v, d]) => ({ value: v, ...d })).sort((a, b) => a.label.localeCompare(b.label));
  }, [allEntries]);

  const allCategories = useMemo(() => {
    const map = new Map<string, number>();
    allEntries.forEach((e) => e.categories.forEach((c) => map.set(c, (map.get(c) || 0) + 1)));
    return Array.from(map).map(([v, c]) => ({ value: v, label: v, count: c })).sort((a, b) => a.label.localeCompare(b.label));
  }, [allEntries]);

  const allTags = useMemo(() => {
    const map = new Map<string, number>();
    allEntries.forEach((e) => e.tags.forEach((t) => map.set(t, (map.get(t) || 0) + 1)));
    return Array.from(map).map(([v, c]) => ({ value: v, label: v, count: c })).sort((a, b) => a.label.localeCompare(b.label));
  }, [allEntries]);

  // Filter + sort
  const filteredEntries = useMemo(() => {
    let results = [...allEntries];

    // Type filter
    if (filterType !== 'all') {
      results = results.filter((e) => e.type === filterType);
    }

    // Region filter (OR within region)
    if (filterRegions.length > 0) {
      results = results.filter((e) => e.regions.some((r) => filterRegions.includes(r)));
    }

    // Category filter (OR)
    if (filterCategories.length > 0) {
      results = results.filter((e) => e.categories.some((c) => filterCategories.includes(c)));
    }

    // Tag filter (OR)
    if (filterTags.length > 0) {
      results = results.filter((e) => e.tags.some((t) => filterTags.includes(t)));
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter((e) => {
        const searchable = [
          e.title,
          e.description,
          ...e.regionNames,
          ...e.categories,
          ...e.tags,
        ].join(' ').toLowerCase();
        return searchable.includes(q);
      });
    }

    // Sort
    results.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'publishDate') {
        const toMs = (d: string) => {
          const parts = d.split('/');
          if (parts.length === 3) return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
          return 0;
        };
        cmp = toMs(a.publishDate) - toMs(b.publishDate);
      } else if (sortBy === 'title') {
        cmp = a.title.localeCompare(b.title);
      } else if (sortBy === 'regions') {
        cmp = a.regions.length - b.regions.length;
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });

    return results;
  }, [allEntries, filterType, filterRegions, filterCategories, filterTags, searchQuery, sortBy, sortDir]);

  const clearAll = () => {
    setSearchQuery('');
    setFilterRegions([]);
    setFilterCategories([]);
    setFilterTags([]);
    setFilterType('all');
    setExpandedSlug(null);
  };

  const hasActiveFilters =
    searchQuery || filterRegions.length > 0 || filterCategories.length > 0 || filterTags.length > 0 || filterType !== 'all';

  return (
    <div className="container">
      <div className="archive-page">
        <Link to="/dashboard" className="archive-back-link">
          <ArrowLeft className="archive-back-link-icon" /> Back to Dashboard
        </Link>

        <header className="archive-header">
          <h1>Intelligence Archive</h1>
          <p>A complete catalog of our content.</p>
        </header>

        {/* ─── Controls ─── */}
        <div className="archive-controls">
          <div className="archive-controls__search">
            <Search size={18} className="archive-search-icon" />
            <input
              type="text"
              placeholder="Search by title, description, region, category, tag…"
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
            <FilterDropdown label="Content Type" options={[
              { value: 'signal-fracture', label: 'Signal & Fracture', count: allEntries.filter((e) => e.type === 'signal-fracture').length },
              { value: 'nexus', label: 'Nexus', count: allEntries.filter((e) => e.type === 'nexus').length },
            ]} selected={filterType === 'all' ? [] : [filterType]} onChange={(vals) => setFilterType(vals.length === 0 ? 'all' : vals[0] as 'signal-fracture' | 'nexus')} />

            <FilterDropdown label="Regions" options={allRegions} selected={filterRegions} onChange={setFilterRegions} />
            <FilterDropdown label="Categories" options={allCategories} selected={filterCategories} onChange={setFilterCategories} />
            <FilterDropdown label="Tags" options={allTags} selected={filterTags} onChange={setFilterTags} />

            <select
              className="archive-controls__sort-select"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as 'publishDate' | 'title' | 'regions');
                setSortDir('desc');
              }}
            >
              <option value="publishDate">Sort: Date</option>
              <option value="title">Sort: Title</option>
              <option value="regions">Sort: Regions</option>
            </select>
            <button
              className="archive-controls__sort"
              onClick={() => setSortDir(sortDir === 'desc' ? 'asc' : 'desc')}
              title={`Toggle sort direction (currently: ${sortDir === 'desc' ? 'descending' : 'ascending'})`}
            >
              {sortDir === 'desc' ? '↓' : '↑'}
            </button>

            {hasActiveFilters && (
              <button className="archive-controls__clear" onClick={clearAll}>
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* ─── Results Info ─── */}
        <div className="archive-results-info">
          <span>
            Showing <strong>{filteredEntries.length}</strong> of <strong>{allEntries.length}</strong> entries
          </span>
        </div>

        {/* ─── Table ─── */}
        {filteredEntries.length > 0 ? (
          <div className="archive-table-wrapper">
            <table className="archive-table">
              <thead>
                <tr>
                  <th className="archive-table__head">Title</th>
                  {/* <th className="archive-table__head">Description</th> */}
                  <th className="archive-table__head">Region(s)</th>
                  <th className="archive-table__head">Published</th>
                  {/* <th className="archive-table__head">Categories</th> */}
                  {/* <th className="archive-table__head">Tags</th> */}
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
