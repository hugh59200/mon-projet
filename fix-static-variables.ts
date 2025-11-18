// fix-static-variables-deep.ts
// -------------------------------------------------------------
// Remplace TOUTES les var(--xxx) statiques par @xxx
// EXCEPTÉ primary-x et secondary-x (dynamiques)
// Parcourt TOUT le projet
// -------------------------------------------------------------

import * as fs from "fs";
import * as path from "path";

const ROOT = "./";
const EXT = [".vue", ".less", ".css", ".scss", ".ts"];

// Prefixes des couleurs statiques
const STATIC_PREFIXES = [
  "neutral",
  "danger",
  "warning",
  "success",
  "grey",
  "gray",
  "info",
  "persian",
  "indigo",
  "pink",
  "brick_red",
  "orange",
  "yellow",
  "blue",
  "blue-info",
  "red"
];

// Core replace
function replaceStaticVars(content: string): string {
  return content.replace(/var\(--([a-zA-Z0-9_-]+)\)/g, (full, name) => {
    const lower = name.toLowerCase();

    // Garder primary/secondary dynamiques
    if (lower.startsWith("primary") || lower.startsWith("secondary")) {
      return full;
    }

    // Remplacer white/black
    if (lower === "white") return "@white";
    if (lower === "black") return "@black";

    // Détecter neutral, warning, success...
    const prefix = lower.split("-")[0];

    if (STATIC_PREFIXES.includes(prefix)) {
      return `@${name}`;
    }

    return full; // inconnu → on ne touche pas
  });
}

// Fix les typos style var(--secondary-100)
function fixTypos(content: string): string {
  return content.replace(/var\(--(secondary|primary)-(\d+)\)0/g, "var(--$1-$2)");
}

function processFile(file: string) {
  const ext = path.extname(file);
  if (!EXT.includes(ext)) return;

  const content = fs.readFileSync(file, "utf8");
  let updated = content;

  updated = replaceStaticVars(updated);
  updated = fixTypos(updated);

  if (updated !== content) {
    fs.writeFileSync(file, updated, "utf8");
    console.log("✔ Corrigé :", file);
  }
}

function walk(dir: string) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      // ignorer node_modules
      if (item === "node_modules" || item.startsWith(".")) continue;
      walk(full);
    } else {
      processFile(full);
    }
  }
}

console.log("⏳ Conversion en cours (scan complet du projet)...");
walk(ROOT);
console.log("🎉 Correction terminée !");
