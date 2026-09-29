import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

const moduleUrl = source => `data:text/javascript;base64,${Buffer.from(ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText).toString("base64")}`;
let calls = [];
globalThis.__tarotFetch = async (path, init) => { calls.push({ path, init }); return Response.json({ data: fixture }); };
const source = (await readFile(new URL("../src/lib/tarot/reading.ts", import.meta.url), "utf8")).replace('import { apiFetch } from "../api";', 'const apiFetch = (...args) => globalThis.__tarotFetch(...args);');
const api = await import(moduleUrl(source));
const deck = moduleUrl(await readFile(new URL("../src/lib/tarotDeck.ts", import.meta.url), "utf8"));
const presentation = await import(moduleUrl((await readFile(new URL("../src/lib/tarot/cardPresentation.ts", import.meta.url), "utf8")).replace('"../tarotDeck"', JSON.stringify(deck))));
const fixture = { id: 10, chat_id: 20, question: "A question", tarot: { id: 1, matrix: { 1: [3, 2], S: [1, 0] } },
  cards: [{ name: "The Fool", image: "https://example.test/fool.png", description: "Description", position: "S", orientation: false },
    { name: "Ace of Cups", image: "https://example.test/ace.png", description: "Second", position: 1, orientation: true }], reading: null };

test("question validation and integer API payload", () => {
  assert.throws(() => api.readingPayload("  \n", "1", "2", "3"));
  assert.deepEqual(api.readingPayload(" question ", "1", "2", "3"), { question: "question", tarot_category_id: 1, tarot_id: 2, speaker_id: 3 });
  assert.throws(() => api.readingPayload("question", "bad", "2", "3"));
});
test("creation uses the shared client, locale and exact payload", async () => {
  calls = [];
  await api.createReading(api.readingPayload("question", "1", "1", "4"), "uk", new AbortController().signal);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].path, "/tarot");
  assert.equal(calls[0].init.method, "POST");
  assert.equal(calls[0].init.headers.get("Accept-Language"), "uk");
  assert.equal(calls[0].init.headers.get("X-Platform"), "site");
  assert.equal(JSON.parse(calls[0].init.body).speaker_id, 4);
});
test("normalizes structured JSON and plain answers but not empty or failed generation", () => {
  assert.equal(api.normalizeInterpretation(null), null);
  assert.equal(api.normalizeInterpretation({ interpretation: [] }), null);
  const message = { interpretation: [{ title: "Meaning", text: "Real answer" }], cards: [{ position: "S", text: "Specific meaning" }] };
  assert.deepEqual(api.normalizeInterpretation(JSON.stringify(message)), { sections: message.interpretation, cards: message.cards });
  assert.equal(api.normalizeInterpretation("Plain answer").sections[0].text, "Plain answer");
  assert.throws(() => api.normalizeInterpretation({ status: "failed" }));
  assert.throws(() => api.normalizeInterpretation('{"broken"'));
});
test("cards keep server positions including S regardless of array order", () => {
  const reading = api.normalizeReading(fixture);
  const cards = presentation.presentCards(reading, "en");
  assert.equal(cards[0].position, "S");
  assert.deepEqual(cards.map(c => [c.x, c.y]), [[0, 0], [2, 2]]);
  assert.equal(cards[0].image, "/images/cards/deck/the-fool.png");
  assert.equal(cards[1].image, "/images/cards/deck/ace-of-cups.png");
  reading.reading = { sections: [{ title: "", text: "Answer" }], cards: [{ position: "S", text: "Personal interpretation" }] };
  assert.equal(presentation.presentCards(reading, "en")[0].description, "Description\n\nPersonal interpretation");
});
test("unknown artwork does not substitute another card; localized names resolve", () => {
  const reading = api.normalizeReading(fixture);
  reading.cards[0].name = "Шут";
  assert.equal(presentation.presentCards(reading, "ru")[0].missingArt, false);
  reading.cards[0].name = "An unknown card";
  const card = presentation.presentCards(reading, "en")[0];
  assert.equal(card.missingArt, true);
  assert.equal(card.name.en, "An unknown card");
});
test("stable backend artwork filenames map to local assets across locales", () => {
  const reading = api.normalizeReading(fixture);
  reading.cards[0].name = "A localized name";
  reading.cards[0].image = "https://stagtest.kaelisai.com/image/decks/our_cards/Pentacles14.png";
  reading.cards[1].image = "https://stagtest.kaelisai.com/image/decks/our_cards/12-TheHangedMan.png";
  const cards = presentation.presentCards(reading, "uk");
  assert.equal(cards[0].image, "/images/cards/deck/king-of-pentacles.png");
  assert.equal(cards[1].image, "/images/cards/deck/the-hanged-man.png");
});
test("locale changes preserve server card names, base descriptions and AI text", () => {
  const reading = api.normalizeReading(fixture);
  reading.reading = { sections: [{ title: "Answer", text: "Original AI answer" }], cards: [{ position: "S", text: "Original card interpretation" }] };
  const before = JSON.stringify(reading);
  const english = presentation.presentCards(reading, "en")[0];
  const ukrainian = presentation.presentCards(reading, "uk")[0];
  assert.equal(english.name.en, ukrainian.name.uk);
  assert.equal(ukrainian.description, "Description\n\nOriginal card interpretation");
  assert.equal(ukrainian.image, english.image);
  assert.equal(ukrainian.reversed, english.reversed);
  assert.equal(JSON.stringify(reading), before);
});

test("card descriptions handle pending and missing text without empty paragraphs", () => {
  const reading = api.normalizeReading(fixture);
  assert.equal(presentation.presentCards(reading, "en")[0].description, "Description");
  reading.cards[0].description = null;
  assert.equal(presentation.presentCards(reading, "en")[0].description, "");
  reading.reading = { sections: [{ title: "", text: "Answer" }], cards: [{ position: "S", text: "AI text" }] };
  assert.equal(presentation.presentCards(reading, "en")[0].description, "AI text");
  assert.equal(presentation.presentCards(reading, "en")[1].description, "Second");
});
test("rejects missing, duplicated and unmapped cards instead of inventing a layout", () => {
  assert.throws(() => api.normalizeReading({ ...fixture, cards: [fixture.cards[0]] }));
  assert.throws(() => api.normalizeReading({ ...fixture, cards: [fixture.cards[0], fixture.cards[0]] }));
  assert.throws(() => api.normalizeReading({ ...fixture, tarot: { id: 1, matrix: { 1: [0, NaN] } } }));
});
test("only accepts message URLs for this backend and this reading's chat", () => {
  assert.equal(api.messagePath("https://stagtest.kaelisai.com/api/chat/20/message/3", "20"), "/chat/20/message/3");
  assert.equal(api.messagePath("/chat/20/message/3", "20"), "/chat/20/message/3");
  for (const path of ["https://evil.test/api/chat/20/message/3", "/chat/21/message/3", "/chat/20/message/3?next=bad", "/user"]) assert.equal(api.messagePath(path, "20"), null);
});
