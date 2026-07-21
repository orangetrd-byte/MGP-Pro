'use strict';

const assert = require('assert');

function approxEq(actual, expected, tol = 1e-4) {
  assert(Math.abs(actual - expected) < tol, `Expected ~${expected}, got ${actual}`);
}

function calcRpmInch(sfm, dia) {
  if (!dia || dia <= 0) return null;
  return (sfm * 3.8197) / dia;
}

function calcRpmMetric(vc, dia) {
  if (!dia || dia <= 0) return null;
  return (vc * 1000) / (Math.PI * dia);
}

function pitch(tpi) {
  if (!tpi) return null;
  return 1 / tpi;
}

function threadDiametersByTPI(major, tpi) {
  const p = pitch(tpi);
  if (p == null || !major) return null;
  return {
    pitch: major - 0.64952 * p,
    minorExternal: major - 1.29904 * p,
  };
}

function tapDrillBasic(major, tpi) {
  const p = pitch(tpi);
  if (p == null) return null;
  return major - p;
}

function threadPercentByDrill(major, tpi, drill) {
  const p = pitch(tpi);
  if (p == null) return null;
  const pitchDia = major - 0.64952 * p;
  const minorDia = major - 1.08253 * p;
  return ((pitchDia - drill) / (pitchDia - minorDia)) * 100;
}

function threeWireParams(major, tpi) {
  const p = pitch(tpi);
  if (p == null) return null;
  const E = 1.01036 * p / 2;
  const pitchDia = major - 0.64952 * p;
  const M = pitchDia + 3 * E - 0.86603 * p;
  return { E, M };
}

function truePosition(x, y) {
  if (x == null || y == null) return null;
  return 2 * Math.sqrt(x * x + y * y);
}

function hardnessHRBtoHRC(hrb) {
  return 0.5217 * hrb - 12.95;
}

function hardnessHRCtoHB(hrc) {
  return 9.85 * hrc + 65;
}

function hardnessHRCtoHRB(hrc) {
  return (hrc + 12.95) / 0.5217;
}

function hardnessHRCtoHV(hrc) {
  return 9.37 * hrc + 105;
}

function hardnessHBtoHRC(hb) {
  return (hb - 65) / 9.85;
}

function hardnessHVtoHRC(hv) {
  return (hv - 105) / 9.37;
}

function materialWeightLb(volIn3, densityLbPerIn3) {
  if (volIn3 == null || !Number.isFinite(densityLbPerIn3)) return null;
  return volIn3 * densityLbPerIn3;
}

approxEq(calcRpmInch(100, 4), 95.4925, 1e-4);
approxEq(calcRpmMetric(100, 100), 318.30988618, 1e-6);

const t = threadDiametersByTPI(0.5, 13);
approxEq(t.pitch, 0.44992, 1e-3);
approxEq(t.minorExternal, 0.39999, 1e-3);
approxEq(tapDrillBasic(0.5, 13), 0.42307692, 1e-4);
approxEq(threadPercentByDrill(0.5, 13, 0.42308), 80.93116, 1e-3);

const wire = threeWireParams(0.5, 13);
approxEq(wire.E, 0.03924, 1e-3);
approxEq(wire.M, 0.5, 1e-3);

approxEq(truePosition(0.002, 0.002), 0.00565685, 1e-4);
approxEq(truePosition(-0.003, 0.001), 0.00632456, 1e-4);

approxEq(hardnessHRBtoHRC(90), 34, 0.2);
approxEq(hardnessHRCtoHB(60), 656, 1);
approxEq(hardnessHRCtoHRB(60), 139.83132, 1e-3);
approxEq(hardnessHRCtoHV(60), 667.2, 1);
approxEq(hardnessHBtoHRC(300), 23.86, 0.1);
approxEq(hardnessHVtoHRC(600), 52.83, 0.1);

approxEq(materialWeightLb(10, 0.284), 2.84, 1e-3);
approxEq(materialWeightLb(25.4, 0.098), 2.4892, 1e-3);

console.log('PASS: phase-one math tests');
