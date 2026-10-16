/**
 * Brand data for the Kasu Direct Booking brand guide.
 *
 * This is the single source of truth for every brand-specific value the guide
 * shows: palettes, copy, status, and asset locations. Shared CSS never holds a
 * brand hex; app.js turns these palettes into semantic custom properties.
 *
 * Palette swatches list the legacy storefront slot names they fill (`slots`).
 * LEGACY_SLOT_TO_TOKEN maps each slot to the semantic token the guide uses, so
 * the slot table and the live theme always come from the same data.
 */

/** Legacy storefront slot → semantic token used by this guide's CSS. */
export const LEGACY_SLOT_TO_TOKEN = Object.freeze({
  '--green': '--brand-primary',
  '--green-dark': '--brand-primary-deep',
  '--green-soft': '--brand-primary-soft',
  '--oxblood': '--brand-secondary',
  '--oxblood-light': '--brand-secondary-light',
  '--ivory': '--surface',
  '--ivory-deep': '--surface-raised',
  '--ink': '--text',
  '--muted': '--text-muted',
  '--brand-accent': '--brand-accent',
  '--brand-cta': '--brand-cta',
});

/** What each legacy slot is for. Slot names are roles, not literal colors. */
export const SLOT_ROLES = Object.freeze({
  '--green': 'Brand primary',
  '--green-dark': 'Brand primary, deep (hero overlays, dark sections)',
  '--green-soft': 'Brand primary, soft',
  '--oxblood': 'Brand secondary / emphasis (<em> in headlines)',
  '--oxblood-light': 'Secondary, light',
  '--ivory': 'Page surface',
  '--ivory-deep': 'Raised or alternate surface',
  '--ink': 'Primary text',
  '--muted': 'Secondary text',
  '--brand-accent': 'Highlight accent',
  '--brand-cta': 'CTA fill',
});

/** Display labels for a brand's launch status. */
export const STATUS_LABELS = Object.freeze({
  approved: 'Approved standard',
  pilot: 'Pilot',
  concept: 'Concept · not for public launch',
});

/** Brand key used when a brand has no tokenized palette of its own yet. */
export const FALLBACK_BRAND_KEY = 'kasu-resorts';

/** Platform strings, used verbatim on every brand. */
export const PLATFORM_STRINGS = Object.freeze([
  { key: 'Powered-by label', copy: 'Powered by Kasu' },
  { key: 'Checkout statement', copy: 'Secure booking and payment powered by Kasu.' },
  { key: 'Support label', copy: 'Kasu Guest Care' },
  { key: 'Product name pattern', copy: '{Brand} reservation · Powered by Kasu' },
]);

/**
 * The five public brands, in portfolio order.
 * Headlines mark emphasis with *asterisks*; app.js renders those as <em>.
 */
export const BRANDS = Object.freeze([
  {
    key: 'kasu-resorts',
    name: 'Kasu Resorts',
    isSubBrand: false,
    status: 'pilot',
    domain: 'kasuresorts.com',
    signature: 'Bring everyone.',
    headline: 'Everyone gets a vacation. *Even the person who planned it.*',
    positioning:
      'Private resort vacation homes built for families and groups. Broad trust, design, hosting, milestones, and family utility. Family-planner relief.',
    demandGroup: 'Families, reunions, milestones, affinity groups',
    promise: 'Design-led large-group stays',
    productTruth:
      "Every generation considered: one private property, entirely on your group's schedule.",
    pillars: ['Play', 'Gather', 'Rest'],
    organizerTerm: 'planner',
    organizerCtas: ['For planners', 'Start a trip brief', 'Send the trip brief'],
    verifiedLabel: 'Stay verified',
    tone: null,
    extraCopy: [
      { label: 'Collection headline', copy: 'Designed for everyone under one roof.' },
      { label: 'Planner headline', copy: "You got everyone here. We'll take it from here." },
      { label: 'Empty state', copy: 'The next private resort is coming · Join the guest list' },
    ],
    visualDirection:
      'Blue Sky system. Full-viewport hero over Graphite with a Graphite gradient shade, sentence-case headlines at weight 800, a transparent header with pill CTAs, and small outlined chips for hero sub-points.',
    typeDirection: 'Neue Haas Grotesk / Helvetica direction, with EB Garamond for human moments.',
    monogramSrc: 'assets/logos/kasu-resorts-mark.svg',
    lockupSrc: 'assets/logos/kasu-resorts-lockup.svg',
    lockupOnDarkSrc: 'assets/logos/kasu-resorts-lockup-on-dark.svg',
    palette: [
      { name: 'Deep Sky', hex: '#475C6B', role: 'Primary brand color', slots: ['--green', '--oxblood'] },
      { name: 'Horizon Haze', hex: '#A9BCC7', role: 'Accent, CTA fill, status dots', slots: ['--green-soft', '--oxblood-light', '--brand-accent', '--brand-cta'] },
      { name: 'Cloud', hex: '#E9EDF0', role: 'Light surface, light text on dark, hover fills', slots: ['--ivory-deep'] },
      { name: 'Sunlit Sand', hex: '#F3EFE4', role: 'Page background', slots: ['--ivory'] },
      { name: 'Graphite', hex: '#2F2F2F', role: 'Text, hero background, dark overlays', slots: ['--ink', '--green-dark'] },
      { name: 'Slate Copy', hex: '#5F6B72', role: 'Secondary text', slots: ['--muted'] },
      // Value from the Kasu Resorts brand standard (July 2026). Not mapped to a storefront slot yet.
      { name: 'Mid Sky', hex: '#6E8FA8', role: 'Hover states, subtle highlights, small UI elements', slots: [] },
    ],
    // Status colors from the Kasu Resorts brand standard (July 2026).
    functionalColors: [
      { name: 'Success', hex: '#4A6741', role: 'Positive indicators' },
      { name: 'Warning', hex: '#B8860B', role: 'Caution states' },
      { name: 'Error', hex: '#8B3A3A', role: 'Error states and alerts' },
    ],
    photography: {
      direction: [
        'Natural light, warm tones, and editorial composition. Capture the feeling of a place, not just the space.',
        'Four shot families: aerial overviews, warm interiors, amenity compositions, and detail-led room moments.',
        'A subtle warm grade with muted saturation. No heavy filters, vignettes, HDR, or oversaturated skies.',
        'Aspect ratios: 16:9 for heroes, 4:5 for social, 1:1 for grids.',
      ],
      // NOTE: Cleared for this guide by the brand owner (October 2026); formal proof classes still need recording.
      photos: [
        { src: 'assets/photos/kasu-resorts/clearwater1-aerial-full-property.jpg', width: 1600, height: 893, family: 'Aerial overview', property: 'Clearwater 1', alt: 'Top-down aerial of a private backyard with a pool, hot tub, sport court, putting green, sand court, fire pit, and playground.' },
        { src: 'assets/photos/kasu-resorts/clearwater1-aerial-pool-loungers.jpg', width: 1600, height: 893, family: 'Amenity composition', property: 'Clearwater 1', alt: 'Pool deck at dusk with six loungers under white umbrellas, a hot tub, and a sport court beside the pool.' },
        { src: 'assets/photos/kasu-resorts/clearwater1-grill-pool-hottub-court.jpg', width: 1600, height: 893, family: 'Amenity composition', property: 'Clearwater 1', alt: 'Outdoor kitchen with a built-in grill in the foreground, a hot tub and pool behind it, and a covered dining patio at golden hour.' },
        { src: 'assets/photos/kasu-resorts/clearwater2-aerial-property.jpg', width: 1600, height: 893, family: 'Aerial overview', property: 'Clearwater 2', alt: 'Angled aerial of a red-roofed house with a pool, sport court, small soccer pitch, and putting green surrounded by trees.' },
        { src: 'assets/photos/kasu-resorts/clearwater2-bunk-room.jpg', width: 1600, height: 893, family: 'Detail-led room moment', property: 'Clearwater 2', alt: 'Sage-green bunk room with a built-in bunk bed, rope-net rail, white linens, folded towels, and an arched mirror.' },
        { src: 'assets/photos/kasu-resorts/location-beach-horizon.jpg', width: 1600, height: 1066, family: 'Location', property: 'Clearwater Beach area', alt: 'Wide view of white sand, calm turquoise water, and an overcast horizon.' },
        { src: 'assets/photos/kasu-resorts/location-beach-shoreline.jpg', width: 1600, height: 1066, family: 'Location', property: 'Clearwater Beach area', alt: 'Shoreline curving into the distance with gentle waves under a soft overcast sky.' },
        { src: 'assets/photos/kasu-resorts/location-beach-waves-closeup.jpg', width: 1600, height: 1066, family: 'Location', property: 'Clearwater Beach area', alt: 'Close view of small waves breaking onto pale sand.' },
        { src: 'assets/photos/kasu-resorts/location-surfboard-rack.jpg', width: 1600, height: 1066, family: 'Location', property: 'Clearwater Beach area', alt: 'Teal paddleboards standing in a metal rack beneath a palm tree.' },
      ],
    },
  },
  {
    key: 'padel-house',
    name: 'Padel House by Kasu',
    isSubBrand: true,
    status: 'approved',
    domain: 'padelhousebykasu.com',
    signature: 'The club is yours.',
    headline: 'Padel trips, *perfected.*',
    positioning:
      "Private padel retreats for playing, training, recovering, and gathering. Whole-house club access, entirely on your group's schedule. An editorial private-club world: padel, wellness, design, pool, community.",
    demandGroup: 'Club captains, pros, tournament organizers',
    promise: 'A private-club padel trip',
    productTruth: 'Club cadence, courts and access, competition, captains, and recovery.',
    pillars: [],
    organizerTerm: 'captain',
    organizerCtas: ['For captains', 'Start a captain brief'],
    verifiedLabel: 'Padel verified.',
    tone: 'Confident club insider. Private, unhurried, never exclusionary.',
    extraCopy: [
      {
        label: 'Empty state',
        copy: 'We will only publish a Padel House once its court and supporting club amenities have been verified.',
      },
    ],
    visualDirection:
      'Bottle green, oxblood, warm ivory, and deep neutrals. The PH court monogram (Option A) anchors the identity. Travel-first category.',
    typeDirection: null,
    monogramSrc: 'assets/logos/padel-house-monogram.svg',
    lockupSrc: 'assets/logos/padel-house-lockup.svg',
    lockupOnDarkSrc: 'assets/logos/padel-house-lockup-on-dark.svg',
    palette: [
      { name: 'Bottle Green', hex: '#173B32', role: 'Primary', slots: ['--green'] },
      { name: 'Deep Green', hex: '#0D2922', role: 'Primary, deep', slots: ['--green-dark'] },
      { name: 'Soft Green', hex: '#3D6357', role: 'Primary, soft', slots: ['--green-soft'] },
      { name: 'Oxblood', hex: '#722B35', role: 'Headline emphasis', slots: ['--oxblood'] },
      { name: 'Light Oxblood', hex: '#9B4C58', role: 'Secondary, light', slots: ['--oxblood-light'] },
      { name: 'Warm Ivory', hex: '#F4F0E6', role: 'Page surface', slots: ['--ivory'] },
      { name: 'Deep Ivory', hex: '#E4DDCF', role: 'Raised surface', slots: ['--ivory-deep'] },
      { name: 'Ink', hex: '#18211D', role: 'Text', slots: ['--ink'] },
      { name: 'Muted', hex: '#696E68', role: 'Secondary text', slots: ['--muted'] },
      { name: 'Pale Gold', hex: '#F6DDA2', role: 'Highlight accent', slots: ['--brand-accent'] },
      { name: 'CTA', hex: '#9C9070', role: 'CTA fill', slots: ['--brand-cta'] },
    ],
  },
  {
    key: 'pickle-house',
    name: 'Pickle House by Kasu',
    isSubBrand: true,
    status: 'concept',
    domain: null,
    signature: 'The house is in play.',
    headline: 'Your court. *Your people.*',
    positioning:
      'Private pickleball vacation homes for players, clubs, and families. The complete house includes everyone. Social play, mixed groups, accessible utility, group energy.',
    demandGroup: 'Club managers, coaches, captains, mixed groups',
    promise: 'A social pickleball stay',
    productTruth: 'Editorial warmth plus clear utility.',
    pillars: [],
    organizerTerm: 'captain',
    organizerCtas: ['For captains', 'Start a captain brief'],
    verifiedLabel: 'Pickleball verified.',
    tone: 'Sociable, inclusive, energetic, practical.',
    extraCopy: [],
    visualDirection:
      'Deep Club Navy, Court Teal, Pool Blue, Warm Cream, Sun Yellow, and Faded Terracotta. Editorial warmth with clear utility.',
    typeDirection: null,
    // NOTE: swatch names are matched to values by role and still need confirming against the standard.
    paletteNamesPending: true,
    monogramSrc: 'assets/logos/pickle-house-monogram.svg',
    lockupSrc: 'assets/logos/pickle-house-lockup.svg',
    lockupOnDarkSrc: 'assets/logos/pickle-house-lockup-on-dark.svg',
    palette: [
      { name: 'Court Teal', hex: '#1E5762', role: 'Primary', slots: ['--green'] },
      { name: 'Deep Club Navy', hex: '#122C3D', role: 'Primary deep and text', slots: ['--green-dark', '--ink'] },
      { name: 'Pool Blue', hex: '#557F95', role: 'Primary, soft', slots: ['--green-soft'] },
      { name: 'Faded Terracotta', hex: '#BD5D43', role: 'Headline emphasis', slots: ['--oxblood'] },
      { name: 'Sun Yellow', hex: '#EFBD38', role: 'Accent and CTA fill', slots: ['--oxblood-light', '--brand-accent', '--brand-cta'] },
      { name: 'Warm Cream', hex: '#F5EFE3', role: 'Page surface', slots: ['--ivory'] },
      { name: 'Deep Cream', hex: '#E5D9C7', role: 'Raised surface', slots: ['--ivory-deep'] },
      { name: 'Muted', hex: '#607079', role: 'Secondary text', slots: ['--muted'] },
    ],
  },
  {
    key: 'set-house',
    name: 'SET HOUSE by Kasu',
    isSubBrand: true,
    status: 'concept',
    domain: null,
    signature: 'The house is set.',
    headline: 'Bring the *whole cast.*',
    positioning:
      'Group stays centered on a commercial-grade gym for gym owners, coaches, and active communities. Training proof, equipment, coaching flow, recovery, nutrition.',
    demandGroup: 'Gym owners, coaches, active communities',
    promise: 'A group stay centered on a commercial-grade gym',
    productTruth: 'Precision without pressure.',
    pillars: [],
    organizerTerm: null,
    organizerCtas: [],
    verifiedLabel: null,
    tone: null,
    extraCopy: [],
    visualDirection:
      'Disciplined grotesk typography, useful equipment data, and architectural grids.',
    typeDirection: 'Disciplined grotesk.',
    plannedColors: ['Chalk', 'Carbon', 'Eucalyptus', 'Signal Blue', 'Clay', 'Steel'],
    monogramSrc: 'assets/logos/set-house-monogram.svg',
    lockupSrc: 'assets/logos/set-house-lockup.svg',
    lockupOnDarkSrc: 'assets/logos/set-house-lockup-on-dark.svg',
    palette: null,
  },
  {
    key: 'ours',
    name: 'OURS by Kasu',
    isSubBrand: true,
    status: 'concept',
    domain: null,
    signature: 'Make it ours.',
    headline: 'A house worth *gathering around.*',
    positioning:
      'A recurring place that feels like the group’s own, for multigenerational families and recurring friend-families. Emotional continuity, traditions, recurring dates, return, belonging.',
    demandGroup: 'Multigenerational families, recurring friend-families',
    promise: "A recurring place that feels like the group's own",
    productTruth: 'Traditions, recurring dates, return, and belonging.',
    pillars: [],
    organizerTerm: null,
    organizerCtas: [],
    verifiedLabel: null,
    tone: null,
    extraCopy: [],
    guardrail:
      'Ownership language must never imply legal ownership. No “own your vacation home,” “your share,” or “equity.”',
    visualDirection: 'Warm editorial serif.',
    typeDirection: 'Warm editorial serif.',
    plannedColors: ['Old Paper', 'Linen', 'Deep Pine', 'Lake Glass', 'Butter Table', 'Faded Red', 'Moss'],
    monogramSrc: 'assets/logos/ours-monogram.svg',
    lockupSrc: 'assets/logos/ours-lockup.svg',
    lockupOnDarkSrc: 'assets/logos/ours-lockup-on-dark.svg',
    palette: null,
  },
]);
