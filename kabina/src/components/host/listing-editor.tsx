"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { saveListing, type ListingFormState } from "@/app/actions/listings";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Select, Switch, Textarea } from "@/components/ui/field";
import { useT } from "@/lib/i18n/client";
import { AMENITIES, CANCELLATION_POLICIES, CURRENCIES, EQUIPMENT_CATEGORIES, LISTING_TYPES, WEEKDAYS, type OpeningHours, DEFAULT_OPENING_HOURS } from "@/lib/constants";
import { COUNTRY_CODES, COVERS, TIMEZONES } from "@/lib/covers";
import { cn, formatHour } from "@/lib/utils";
import type { Listing, ListingAddon, ListingPhoto } from "@/db/schema";

export type EditorListing = (Listing & { photos: ListingPhoto[]; addons: ListingAddon[] }) | null;

const HOURS = Array.from({ length: 25 }, (_, h) => h);

export function ListingEditor({ listing }: { listing: EditorListing }) {
  const { t, locale } = useT();
  const w = t.host.wizard;
  const f = w.fields;
  const [state, action, pending] = useActionState<ListingFormState, FormData>(saveListing, null);
  const errors = state?.errors ?? {};

  const [photos, setPhotos] = useState<string[]>(listing?.photos.map((p) => p.url) ?? []);
  const [addons, setAddons] = useState<{ name: string; price: string; unit: "hour" | "session" }[]>(listing?.addons.map((a) => ({ name: a.name, price: String(a.priceCents / 100), unit: a.unit })) ?? []);
  const [hours, setHours] = useState<OpeningHours>(listing?.openingHours ?? DEFAULT_OPENING_HOURS);
  const [instant, setInstant] = useState(listing?.instantBook ?? true);
  const [engineer, setEngineer] = useState(listing?.engineerAvailable ?? false);
  const [showCovers, setShowCovers] = useState(false);
  const regionNames = new Intl.DisplayNames([locale === "es" ? "es" : "en"], { type: "region" });

  const steps = Object.entries(w.steps) as [keyof typeof w.steps, string][];

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[220px_1fr]">
      {listing ? <input type="hidden" name="id" value={listing.id} /> : null}
      <aside className="hidden lg:block">
        <nav className="sticky top-24 space-y-1 text-sm">
          {steps.map(([key, label], i) => (
            <a key={key} href={`#step-${key}`} className="block rounded-lg px-3 py-2 text-ink-600 hover:bg-ink-100 hover:text-ink-950">
              <span className="mr-2 text-ink-400">{i + 1}</span>
              {label}
            </a>
          ))}
        </nav>
      </aside>

      <div className="space-y-10">
        {/* Basics */}
        <Section id="step-basics" title={w.steps.basics} n={1}>
          <Field label={f.title} htmlFor="title" error={errors.title}>
            <Input id="title" name="title" defaultValue={listing?.title} placeholder={f.titlePlaceholder} required minLength={5} />
          </Field>
          <Field label={f.type} htmlFor="type">
            <Select id="type" name="type" defaultValue={listing?.type ?? "recording"}>
              {LISTING_TYPES.map((type) => (
                <option key={type} value={type}>
                  {t.types[type].label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={f.description} htmlFor="description" error={errors.description}>
            <Textarea id="description" name="description" defaultValue={listing?.description} placeholder={f.descriptionPlaceholder} required minLength={40} className="min-h-40" />
          </Field>
        </Section>

        {/* Location */}
        <Section id="step-location" title={w.steps.location} n={2}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={f.city} htmlFor="city" error={errors.city}>
              <Input id="city" name="city" defaultValue={listing?.city} required />
            </Field>
            <Field label={f.neighborhood} htmlFor="neighborhood">
              <Input id="neighborhood" name="neighborhood" defaultValue={listing?.neighborhood ?? ""} />
            </Field>
            <Field label={f.country} htmlFor="countryCode">
              <Select id="countryCode" name="countryCode" defaultValue={listing?.countryCode ?? "ES"}>
                {COUNTRY_CODES.map((c) => (
                  <option key={c} value={c}>
                    {regionNames.of(c)}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={f.timezone} htmlFor="timezone">
              <Select id="timezone" name="timezone" defaultValue={listing?.timezone ?? "Europe/Madrid"}>
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label={f.address} htmlFor="address">
            <Input id="address" name="address" defaultValue={listing?.address ?? ""} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={f.lat} htmlFor="lat">
              <Input id="lat" name="lat" type="number" step="any" defaultValue={listing?.lat ?? ""} placeholder="40.4168" />
            </Field>
            <Field label={f.lng} htmlFor="lng">
              <Input id="lng" name="lng" type="number" step="any" defaultValue={listing?.lng ?? ""} placeholder="-3.7038" />
            </Field>
          </div>
          <p className="text-xs text-ink-500">{f.coordsHint}</p>
        </Section>

        {/* Space */}
        <Section id="step-space" title={w.steps.space} n={3}>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label={f.sizeM2} htmlFor="sizeM2">
              <Input id="sizeM2" name="sizeM2" type="number" min={1} defaultValue={listing?.sizeM2 ?? ""} />
            </Field>
            <Field label={f.capacity} htmlFor="capacity">
              <Input id="capacity" name="capacity" type="number" min={1} defaultValue={listing?.capacity ?? 4} required />
            </Field>
            <Field label={f.rooms} htmlFor="rooms">
              <Input id="rooms" name="rooms" type="number" min={1} defaultValue={listing?.rooms ?? 1} required />
            </Field>
          </div>
        </Section>

        {/* Equipment */}
        <Section id="step-equipment" title={w.steps.equipment} n={4} hint={f.equipmentHint}>
          <div className="grid gap-4 sm:grid-cols-2">
            {EQUIPMENT_CATEGORIES.map((cat) => (
              <Field key={cat} label={t.equipment[cat]} htmlFor={`equipment_${cat}`}>
                <Textarea id={`equipment_${cat}`} name={`equipment_${cat}`} defaultValue={(listing?.equipment[cat] ?? []).join("\n")} className="min-h-24 text-sm" />
              </Field>
            ))}
          </div>
        </Section>

        {/* Amenities */}
        <Section id="step-amenities" title={w.steps.amenities} n={5}>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {AMENITIES.map((a) => (
              <Checkbox key={a} name="amenities" value={a} defaultChecked={listing?.amenities.includes(a)} label={t.amenities[a]} className="rounded-xl border border-ink-100 bg-white p-3" />
            ))}
          </div>
        </Section>

        {/* Photos */}
        <Section id="step-photos" title={w.steps.photos} n={6} hint={f.photosHint} error={errors.photos}>
          <ul className="space-y-2">
            {photos.map((url, i) => (
              <li key={i} className="flex items-center gap-2">
                {url ? <img src={url} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" /> : <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-400"><ImageIcon className="h-4 w-4" /></span>}
                <Input name="photos" value={url} onChange={(e) => setPhotos((p) => p.map((x, j) => (j === i ? e.target.value : x)))} placeholder="https://…" aria-label={f.photoUrl} />
                <Button type="button" variant="ghost" size="icon" onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))} aria-label={f.removePhoto}>
                  <Trash2 className="h-4 w-4" aria-hidden />
                </Button>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setPhotos((p) => [...p, ""])}>
              <Plus className="h-4 w-4" aria-hidden /> {f.addPhoto}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowCovers((s) => !s)}>
              <ImageIcon className="h-4 w-4" aria-hidden /> {f.useCover}
            </Button>
          </div>
          {showCovers ? (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {COVERS.map((c) => (
                <button key={c} type="button" onClick={() => setPhotos((p) => [...p, c])} className="overflow-hidden rounded-lg ring-2 ring-transparent hover:ring-brand-400">
                  <img src={c} alt="" className="aspect-[4/3] w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </Section>

        {/* Pricing */}
        <Section id="step-pricing" title={w.steps.pricing} n={7}>
          <div className="grid gap-4 sm:grid-cols-4">
            <Field label={f.hourlyRate} htmlFor="hourlyRate" error={errors.hourlyRate} className="sm:col-span-2">
              <Input id="hourlyRate" name="hourlyRate" type="number" min={1} step="0.01" defaultValue={listing ? listing.hourlyRate / 100 : ""} required />
            </Field>
            <Field label={f.currency} htmlFor="currency">
              <Select id="currency" name="currency" defaultValue={listing?.currency ?? "EUR"}>
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={f.minHours} htmlFor="minHours">
              <Input id="minHours" name="minHours" type="number" min={1} max={24} defaultValue={listing?.minHours ?? 2} required />
            </Field>
            <Field label={f.maxHours} htmlFor="maxHours" error={errors.maxHours}>
              <Input id="maxHours" name="maxHours" type="number" min={1} max={24} defaultValue={listing?.maxHours ?? 10} required />
            </Field>
          </div>
          <div className="rounded-2xl border border-ink-100 bg-white p-4">
            <Switch checked={instant} onChange={setInstant} name="instantBook" label={<span className="font-semibold">{f.instantBook}</span>} />
            <p className="mt-1 pl-15 text-xs text-ink-500">{f.instantBookHelp}</p>
          </div>
          <div className="rounded-2xl border border-ink-100 bg-white p-4">
            <Switch checked={engineer} onChange={setEngineer} name="engineerAvailable" label={<span className="font-semibold">{f.engineerAvailable}</span>} />
            {engineer ? (
              <Field label={f.engineerRate} htmlFor="engineerRate" className="mt-3 max-w-xs">
                <Input id="engineerRate" name="engineerRate" type="number" min={1} step="0.01" defaultValue={listing?.engineerRate ? listing.engineerRate / 100 : ""} />
              </Field>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.listing.offPeak + " (%)"} htmlFor="offPeakDiscount">
              <Input id="offPeakDiscount" name="offPeakDiscount" type="number" min={0} max={70} defaultValue={listing?.offPeakDiscount ?? 0} />
            </Field>
            <Field label={t.listing.endTime} htmlFor="offPeakEndHour">
              <Select id="offPeakEndHour" name="offPeakEndHour" defaultValue={listing?.offPeakEndHour ?? 14}>
                {HOURS.slice(1, 24).map((h) => (
                  <option key={h} value={h}>
                    {formatHour(h)}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <div>
            <p className="mb-1.5 text-sm font-semibold text-ink-800">{f.addons}</p>
            <ul className="space-y-2">
              {addons.map((a, i) => (
                <li key={i} className="grid grid-cols-[1fr_110px_120px_auto] gap-2">
                  <Input name="addon_name" value={a.name} onChange={(e) => setAddons((list) => list.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} placeholder={f.addonName} />
                  <Input name="addon_price" type="number" min={0} step="0.01" value={a.price} onChange={(e) => setAddons((list) => list.map((x, j) => (j === i ? { ...x, price: e.target.value } : x)))} placeholder={f.addonPrice} />
                  <Select name="addon_unit" value={a.unit} onChange={(e) => setAddons((list) => list.map((x, j) => (j === i ? { ...x, unit: e.target.value as "hour" | "session" } : x)))}>
                    <option value="session">{f.addonPerSession}</option>
                    <option value="hour">{f.addonPerHour}</option>
                  </Select>
                  <Button type="button" variant="ghost" size="icon" onClick={() => setAddons((list) => list.filter((_, j) => j !== i))} aria-label={t.common.delete}>
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </Button>
                </li>
              ))}
            </ul>
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => setAddons((l) => [...l, { name: "", price: "", unit: "session" }])}>
              <Plus className="h-4 w-4" aria-hidden /> {f.addAddon}
            </Button>
          </div>
        </Section>

        {/* Availability */}
        <Section id="step-availability" title={w.steps.availability} n={8}>
          <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
            {WEEKDAYS.map((d) => {
              const h = hours[d];
              return (
                <div key={d} className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-ink-100 px-4 py-2.5 last:border-0 sm:grid-cols-[120px_1fr]">
                  <span className="text-sm font-medium">{t.weekdays.long[d]}</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex items-center gap-2 text-sm text-ink-600">
                      <input type="checkbox" name={`hours_${d}_closed`} value="1" checked={!h} onChange={(e) => setHours((prev) => ({ ...prev, [d]: e.target.checked ? null : { open: 10, close: 22 } }))} className="accent-ink-950" />
                      {f.closed}
                    </label>
                    {h ? (
                      <>
                        <Select name={`hours_${d}_open`} value={h.open} onChange={(e) => setHours((prev) => ({ ...prev, [d]: { open: Number(e.target.value), close: Math.max(Number(e.target.value) + 1, h.close) } }))} className="w-28 py-1.5 text-sm" aria-label={f.open}>
                          {HOURS.slice(0, 24).map((x) => (
                            <option key={x} value={x}>
                              {formatHour(x)}
                            </option>
                          ))}
                        </Select>
                        <span className="text-ink-400">→</span>
                        <Select name={`hours_${d}_close`} value={h.close} onChange={(e) => setHours((prev) => ({ ...prev, [d]: { open: h.open, close: Number(e.target.value) } }))} className="w-28 py-1.5 text-sm" aria-label={f.close}>
                          {HOURS.filter((x) => x > h.open).map((x) => (
                            <option key={x} value={x}>
                              {formatHour(x)}
                            </option>
                          ))}
                        </Select>
                      </>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Rules */}
        <Section id="step-rules" title={w.steps.rules} n={9}>
          <Field label={f.rules} htmlFor="rules">
            <Textarea id="rules" name="rules" defaultValue={listing?.rules ?? ""} placeholder={f.rulesPlaceholder} />
          </Field>
          <div>
            <p className="mb-1.5 text-sm font-semibold text-ink-800">{f.cancellationPolicy}</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {CANCELLATION_POLICIES.map((p) => (
                <label key={p} className="flex cursor-pointer gap-3 rounded-xl border border-ink-100 bg-white p-3 has-[:checked]:border-ink-950 has-[:checked]:ring-1 has-[:checked]:ring-ink-950">
                  <input type="radio" name="cancellationPolicy" value={p} defaultChecked={(listing?.cancellationPolicy ?? "moderate") === p} className="mt-1 accent-ink-950" />
                  <span>
                    <span className="block text-sm font-semibold">{t.policies[p].label}</span>
                    <span className="block text-xs text-ink-500">{t.policies[p].description}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </Section>

        {Object.keys(errors).length ? <p className="rounded-xl bg-red-50 p-3 text-sm text-rec">{Object.values(errors)[0]}</p> : null}

        <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-2 border-t border-ink-100 bg-paper/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
          <Button type="submit" name="intent" value="publish" loading={pending}>
            {listing?.status === "published" ? w.saveChanges : w.publish}
          </Button>
          {listing?.status !== "published" ? (
            <Button type="submit" name="intent" value="draft" variant="outline" loading={pending}>
              {w.saveDraft}
            </Button>
          ) : null}
          {listing ? (
            <Link href={`/studios/${listing.slug}`} className="ml-auto text-sm font-medium text-ink-600 hover:text-ink-950">
              {w.preview} →
            </Link>
          ) : null}
        </div>
      </div>
    </form>
  );
}

function Section({ id, title, n, hint, error, children }: { id: string; title: string; n: number; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={cn("scroll-mt-24 space-y-4 rounded-3xl border bg-white p-5 md:p-6", error ? "border-rec" : "border-ink-100")}>
      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-950 font-display text-xs font-bold text-brand-300">{n}</span>
          {title}
        </h2>
        {hint ? <p className="mt-1 text-sm text-ink-500">{hint}</p> : null}
        {error ? <p className="mt-1 text-sm text-rec">{error}</p> : null}
      </div>
      {children}
    </section>
  );
}
