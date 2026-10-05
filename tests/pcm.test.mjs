// Unit tests for the PCM statistics. Run: npm test   (Node 18+)
import { test } from "node:test";
import assert from "node:assert/strict";
import { conformalP, cusumOnset, persistence, chi2sfEven, bh, robust } from "../js/change.js";

test("conformal p-value: the most extreme peer gets the smallest p", () => {
  const scores = Float32Array.from([0.1, 0.4, 0.2, 9.0, 0.3]);
  const p = conformalP(scores);
  assert.equal(Math.min(...p), p[3]);
  assert.ok(Math.abs(p[3] - 2 / 6) < 1e-6);        // (1 + 1) / (5 + 1)
  for (const v of p) assert.ok(v > 0 && v <= 1);
});

test("conformal p-values of tied peers are equal and large", () => {
  const p = conformalP(new Float32Array(10).fill(1));
  for (const v of p) assert.ok(Math.abs(v - 11 / 11) < 1e-6);
});

test("CUSUM finds the onset of a step change", () => {
  const series = [0.2, 0.1, 0.3, 0.2, 3.0, 3.2, 2.9, 3.1];
  assert.equal(cusumOnset(series, 1.5, 3), 5);     // sum crosses h one step after the jump
  assert.equal(cusumOnset([0.2, 0.3, 0.1, 0.2], 1.5, 3), -1);
});

test("persistence counts consecutive significant observations at the end", () => {
  assert.equal(persistence([0.5, 0.01, 0.02, 0.03], 0.05), 3);
  assert.equal(persistence([0.01, 0.02, 0.5], 0.05), 0);
});

test("chi-square survival for even degrees of freedom", () => {
  assert.ok(Math.abs(chi2sfEven(0, 2) - 1) < 1e-12);
  assert.ok(Math.abs(chi2sfEven(4, 2) - Math.exp(-2)) < 1e-12);
  assert.ok(Math.abs(chi2sfEven(4, 4) - Math.exp(-2) * 3) < 1e-12);
});

test("Benjamini-Hochberg: uniform p-values pass nothing, a clear signal passes", () => {
  const n = 200, uni = Array.from({ length: n }, (_, i) => (i + 1) / n);
  assert.equal([...bh(uni)].filter((q) => q <= 0.05).length, 0);
  const withSignal = [1e-6, ...uni.slice(1)];
  const q = bh(withSignal);
  assert.ok(q[0] <= 0.05);
  for (let i = 1; i < q.length; i++) assert.ok(q[i] >= q[0]);
});

test("robust z uses median and MAD, not the mean", () => {
  const [m, d] = robust(Float32Array.from([1, 1, 1, 1, 1, 1, 100]));
  assert.equal(m, 1);
  assert.ok(d < 0.01);                               // one outlier does not inflate the spread
});
