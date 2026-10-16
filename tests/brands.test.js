/**
 * Data checks for js/brands.js. The guide renders everything from this file,
 * so a missing token or malformed value breaks a whole brand's pages.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  BRANDS,
  FALLBACK_BRAND_KEY,
  LEGACY_SLOT_TO_TOKEN,
  SLOT_ROLES,
  STATUS_LABELS,
} from '../js/brands.js';

const HEX_PATTERN = /^#[0-9A-F]{6}$/i;
const LEGACY_SLOTS = Object.keys(LEGACY_SLOT_TO_TOKEN);
const tokenizedBrands = BRANDS.filter((brand) => brand.palette);

test('brand keys are unique', () => {
  const keys = BRANDS.map((brand) => brand.key);
  assert.equal(new Set(keys).size, keys.length);
});

test('fallback brand exists and has a palette', () => {
  const fallback = BRANDS.find((brand) => brand.key === FALLBACK_BRAND_KEY);
  assert.ok(fallback, `missing fallback brand "${FALLBACK_BRAND_KEY}"`);
  assert.ok(fallback.palette, 'fallback brand must have a tokenized palette');
});

test('every legacy slot has a documented role', () => {
  assert.deepEqual(Object.keys(SLOT_ROLES).sort(), [...LEGACY_SLOTS].sort());
});

test('every status has a display label', () => {
  for (const brand of BRANDS) {
    assert.ok(STATUS_LABELS[brand.status], `${brand.key}: unknown status "${brand.status}"`);
  }
});

for (const brand of tokenizedBrands) {
  test(`${brand.key}: palette fills every slot exactly once`, () => {
    const assignedSlots = brand.palette.flatMap((swatch) => swatch.slots);
    for (const slot of assignedSlots) {
      assert.ok(LEGACY_SLOTS.includes(slot), `unknown slot ${slot}`);
    }
    assert.deepEqual([...assignedSlots].sort(), [...LEGACY_SLOTS].sort());
  });

  test(`${brand.key}: assigned swatches have valid hex values`, () => {
    for (const swatch of brand.palette) {
      // Swatches still awaiting a value from the standard may be null, but only if unassigned.
      if (swatch.hex === null) {
        assert.equal(swatch.slots.length, 0, `${swatch.name} has no value but fills slots`);
        continue;
      }
      assert.match(swatch.hex, HEX_PATTERN, `${swatch.name}: ${swatch.hex}`);
    }
  });
}

for (const brand of BRANDS.filter((candidate) => !candidate.palette)) {
  test(`${brand.key}: untokenized brand lists its planned colors`, () => {
    assert.ok(brand.plannedColors?.length, 'plannedColors is required when palette is null');
  });
}

for (const brand of BRANDS) {
  test(`${brand.key}: endorsement naming follows the lockup rules`, () => {
    if (brand.isSubBrand) assert.match(brand.name, / by Kasu$/);
    assert.doesNotMatch(brand.name, /by Kasu Resorts/);
  });

  test(`${brand.key}: headline emphasis markers are balanced`, () => {
    const markerCount = (brand.headline.match(/\*/g) ?? []).length;
    assert.equal(markerCount % 2, 0);
  });

  test(`${brand.key}: asset paths point into assets/logos`, () => {
    assert.match(brand.lockupSrc, /^assets\/logos\/[a-z0-9-]+\.svg$/);
    assert.match(brand.monogramSrc, /^assets\/logos\/[a-z0-9-]+\.svg$/);
  });
}
