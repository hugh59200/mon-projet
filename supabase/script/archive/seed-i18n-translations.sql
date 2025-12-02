-- =========================================
-- 🌍 SEED I18N - Traductions EN pour Products
-- =========================================
-- À exécuter APRÈS migration-i18n.sql et seed-v4.sql

-- ============================
-- 📦 PRODUCTS - Traductions EN
-- ============================

-- BPC-157
UPDATE public.products SET
  name_i18n = '{"en": "BPC-157"}',
  category_i18n = '{"en": "Recovery"}',
  description_i18n = '{"en": "<p><strong>BPC-157 (Body Protection Compound-157)</strong> is a pentadecapeptide composed of 15 amino acids, derived from a protective protein naturally present in the human stomach.</p><p>In research, this peptide is widely studied for its potential cytoprotective and angiogenic properties (formation of new blood vessels).</p><p><strong>Main research areas:</strong></p><ul><li>Acceleration of tendon and ligament healing.</li><li>Reduction of intestinal inflammation.</li><li>Cellular protection against toxins.</li></ul>"}'
WHERE name = 'BPC-157';

-- TB-500
UPDATE public.products SET
  name_i18n = '{"en": "TB-500"}',
  category_i18n = '{"en": "Recovery"}',
  description_i18n = '{"en": "<p><strong>TB-500</strong> is a synthetic version of Thymosin Beta-4, a protein present in almost all human and animal cells. It plays a key role in cellular actin regulation.</p><p>Researchers are interested in its ability to promote cell migration to injured areas, facilitating tissue regeneration.</p><p><strong>Main research areas:</strong></p><ul><li>Reduction of tissue inflammation.</li><li>Improved flexibility and reduced adhesions.</li><li>Post-traumatic muscle recovery.</li></ul>"}'
WHERE name = 'TB-500';

-- Semaglutide
UPDATE public.products SET
  name_i18n = '{"en": "Semaglutide"}',
  category_i18n = '{"en": "Weight Loss"}',
  description_i18n = '{"en": "<p><strong>Semaglutide</strong> is a GLP-1 (Glucagon-Like Peptide-1) receptor agonist. It mimics the action of the natural incretin hormone that regulates blood sugar.</p><p>In the laboratory, it is studied for its ability to slow gastric emptying and influence satiety signals in the hypothalamus.</p><p><strong>Main research areas:</strong></p><ul><li>Insulin and blood sugar regulation.</li><li>Studies on adipose mass reduction.</li><li>Appetite control in animal models.</li></ul>"}'
WHERE name = 'Semaglutide';

-- Tirzepatide
UPDATE public.products SET
  name_i18n = '{"en": "Tirzepatide"}',
  category_i18n = '{"en": "Weight Loss"}',
  description_i18n = '{"en": "<p><strong>Tirzepatide</strong> is an innovative dual-action peptide: it acts as an agonist of both GIP (glucose-dependent insulinotropic polypeptide) and GLP-1 receptors.</p><p>This unique synergy makes it a preferred subject for studying severe metabolic disorders, offering potentially superior efficacy to GLP-1 agonists alone.</p><p><strong>Main research areas:</strong></p><ul><li>GIP/GLP-1 synergy for metabolism.</li><li>Improved insulin sensitivity.</li><li>Significant impact on body composition.</li></ul>"}'
WHERE name = 'Tirzepatide';

-- Retatrutide
UPDATE public.products SET
  name_i18n = '{"en": "Retatrutide"}',
  category_i18n = '{"en": "Weight Loss"}',
  description_i18n = '{"en": "<p><strong>Retatrutide</strong> is a next-generation candidate qualified as a \"triple agonist\" (GLP-1, GIP and Glucagon). It is currently one of the most promising peptides in metabolic research.</p><p>The addition of glucagon receptor agonism aims to increase basal energy expenditure, in addition to satiety effects.</p><p><strong>Main research areas:</strong></p><ul><li>Stimulation of energy expenditure.</li><li>Hepatic lipid regulation.</li><li>Advanced obesity management.</li></ul>"}'
WHERE name = 'Retatrutide';

-- CJC-1295 DAC
UPDATE public.products SET
  name_i18n = '{"en": "CJC-1295 DAC"}',
  category_i18n = '{"en": "Growth"}',
  description_i18n = '{"en": "<p><strong>CJC-1295 with DAC</strong> (Drug Affinity Complex) is a synthetic analog of GHRH (Growth Hormone Releasing Hormone). The DAC modification allows binding to serum albumin, considerably extending its half-life.</p><p>Unlike CJC without DAC, this version maintains elevated physiological growth hormone levels continuously over several days.</p><p><strong>Main research areas:</strong></p><ul><li>Continuous stimulation of GH and IGF-1 secretion.</li><li>Studies on long-term muscle anabolism.</li><li>Improved protein synthesis.</li></ul>"}'
WHERE name = 'CJC-1295 DAC';

-- GHRP-6
UPDATE public.products SET
  name_i18n = '{"en": "GHRP-6"}',
  category_i18n = '{"en": "Growth"}',
  description_i18n = '{"en": "<p><strong>GHRP-6</strong> (Growth Hormone Releasing Peptide-6) is a hexapeptide secretagogue that stimulates growth hormone release from the pituitary gland.</p><p>It is also known for its interaction with ghrelin receptors, which can induce a significant increase in appetite, an effect sought in certain mass-gaining contexts.</p><p><strong>Main research areas:</strong></p><ul><li>Rapid GH secretion peaks.</li><li>Appetite stimulation and mass gain.</li><li>Systemic anti-inflammatory effects.</li></ul>"}'
WHERE name = 'GHRP-6';

-- Hexarelin
UPDATE public.products SET
  name_i18n = '{"en": "Hexarelin"}',
  category_i18n = '{"en": "Growth"}',
  description_i18n = '{"en": "<p><strong>Hexarelin</strong> is considered one of the most potent GH secretagogues available, structurally similar to GHRP-6 but with a higher efficacy profile.</p><p>It has the distinction of not increasing appetite as markedly as GHRP-6, while offering massive GH release.</p><p><strong>Main research areas:</strong></p><ul><li>Maximum increase in plasma GH levels.</li><li>Potential cardioprotective properties.</li><li>Neural recovery.</li></ul>"}'
WHERE name = 'Hexarelin';

-- Sermorelin
UPDATE public.products SET
  name_i18n = '{"en": "Sermorelin"}',
  category_i18n = '{"en": "Anti-aging"}',
  description_i18n = '{"en": "<p><strong>Sermorelin</strong> is a biological analog of GHRH (corresponding to the first 29 amino acids). It is one of the most prescribed peptides in anti-aging clinics in the United States.</p><p>It naturally stimulates the pituitary to produce GH in waves (pulsatile), thus respecting the body''s circadian rhythm.</p><p><strong>Main research areas:</strong></p><ul><li>Improved deep sleep quality.</li><li>Anti-aging effects and general vitality.</li><li>Body composition optimization.</li></ul>"}'
WHERE name = 'Sermorelin';

-- PEG-MGF
UPDATE public.products SET
  name_i18n = '{"en": "PEG-MGF"}',
  category_i18n = '{"en": "Performance"}',
  description_i18n = '{"en": "<p><strong>PEG-MGF</strong> (Pegylated Mechano Growth Factor) is a spliced variant of IGF-1. The addition of polyethylene glycol (PEG) protects the peptide from rapid degradation.</p><p>It is specifically studied for its role in activating muscle satellite cells following mechanical stress (training), promoting local hypertrophy.</p><p><strong>Main research areas:</strong></p><ul><li>Localized muscle repair.</li><li>Muscle stem cell activation.</li><li>Neuroprotection.</li></ul>"}'
WHERE name = 'PEG-MGF';

-- Melanotan 2
UPDATE public.products SET
  name_i18n = '{"en": "Melanotan 2"}',
  category_i18n = '{"en": "Wellness"}',
  description_i18n = '{"en": "<p><strong>Melanotan 2</strong> is a synthetic analog of alpha-melanocyte-stimulating hormone (α-MSH). It primarily acts on melanocortin receptors.</p><p>It is famous for its ability to stimulate melanogenesis (melanin production) without excessive UV exposure, but also has marked effects on libido.</p><p><strong>Main research areas:</strong></p><ul><li>Stimulation of skin pigmentation.</li><li>Improvement of erectile function and libido.</li><li>Appetite reduction.</li></ul>"}'
WHERE name = 'Melanotan 2';

-- PT-141
UPDATE public.products SET
  name_i18n = '{"en": "PT-141"}',
  category_i18n = '{"en": "Wellness"}',
  description_i18n = '{"en": "<p><strong>PT-141 (Bremelanotide)</strong> is a derivative of Melanotan 2, specifically refined to target receptors responsible for sexual arousal, while minimizing the effect on pigmentation.</p><p>Unlike classic treatments (Viagra type) that act on the vascular system, PT-141 acts directly on the central nervous system.</p><p><strong>Main research areas:</strong></p><ul><li>Treatment of hypoactive desire disorders.</li><li>Efficacy in both men and women.</li><li>Action via the central nervous system.</li></ul>"}'
WHERE name = 'PT-141';

-- Kisspeptine-10
UPDATE public.products SET
  name_i18n = '{"en": "Kisspeptine-10"}',
  category_i18n = '{"en": "Hormonal"}',
  description_i18n = '{"en": "<p><strong>Kisspeptine-10</strong> is a potent peptide that initiates GnRH (Gonadotropin-releasing hormone) secretion. It is a key regulator of the reproductive axis.</p><p>In research, it is studied for its ability to restart natural testosterone production without inhibiting spermatogenesis.</p><p><strong>Main research areas:</strong></p><ul><li>Stimulation of LH and FSH.</li><li>HPTA axis restoration.</li><li>Fertility research.</li></ul>"}'
WHERE name = 'Kisspeptine-10';

-- Selank
UPDATE public.products SET
  name_i18n = '{"en": "Selank"}',
  category_i18n = '{"en": "Nootropic"}',
  description_i18n = '{"en": "<p><strong>Selank</strong> is a synthetic peptide derived from tuftsin, naturally produced by the body. It is classified as an anxiolytic and nootropic.</p><p>It modulates the expression of neurotrophic factor BDNF and influences the balance of neurotransmitters (serotonin, dopamine) to stabilize mood.</p><p><strong>Main research areas:</strong></p><ul><li>Reduction of generalized anxiety without sedation.</li><li>Improved mental clarity.</li><li>Immune system strengthening.</li></ul>"}'
WHERE name = 'Selank';

-- Semax
UPDATE public.products SET
  name_i18n = '{"en": "Semax"}',
  category_i18n = '{"en": "Nootropic"}',
  description_i18n = '{"en": "<p><strong>Semax</strong> is a heptapeptide originally developed in Russia to treat strokes. It is a powerful cognitive modulator.</p><p>It significantly increases BDNF (Brain-Derived Neurotrophic Factor) levels, promoting neuron survival and synaptic plasticity.</p><p><strong>Main research areas:</strong></p><ul><li>Improved concentration and memory.</li><li>Neuroprotection in case of hypoxia.</li><li>Reduced mental fatigue.</li></ul>"}'
WHERE name = 'Semax';

-- GHK-Cu
UPDATE public.products SET
  name_i18n = '{"en": "GHK-Cu"}',
  category_i18n = '{"en": "Cosmetic"}',
  description_i18n = '{"en": "<p><strong>GHK-Cu</strong> is a natural peptide-copper complex present in human plasma. Its concentration decreases drastically with age.</p><p>It is famous for its exceptional regenerative properties on skin (collagen synthesis) and hair follicles.</p><p><strong>Main research areas:</strong></p><ul><li>Skin firming and wrinkle reduction.</li><li>Hair growth stimulation.</li><li>Advanced wound healing.</li></ul>"}'
WHERE name = 'GHK-Cu';

-- NAD+
UPDATE public.products SET
  name_i18n = '{"en": "NAD+"}',
  category_i18n = '{"en": "Anti-aging"}',
  description_i18n = '{"en": "<p><strong>NAD+ (Nicotinamide Adenine Dinucleotide)</strong> is a coenzyme present in all living cells, essential for energy production (ATP) in mitochondria.</p><p>NAD+ levels drop with age, which is linked to cellular and metabolic aging. Supplementation is a major avenue of anti-aging research.</p><p><strong>Main research areas:</strong></p><ul><li>Restoration of mitochondrial function.</li><li>DNA repair (sirtuin activation).</li><li>Improved cellular and cognitive energy.</li></ul>"}'
WHERE name = 'NAD+';

-- Thymosin Alpha-1
UPDATE public.products SET
  name_i18n = '{"en": "Thymosin Alpha-1"}',
  category_i18n = '{"en": "Health"}',
  description_i18n = '{"en": "<p><strong>Thymosin Alpha-1</strong> is a natural thymic peptide that plays a crucial role in immune system modulation.</p><p>It helps with T lymphocyte maturation. It is studied for its ability to strengthen immune response against viral infections and immune system aging (immunosenescence).</p><p><strong>Main research areas:</strong></p><ul><li>Immune defense strengthening.</li><li>Antiviral and antifungal properties.</li><li>Improved vaccine efficacy.</li></ul>"}'
WHERE name = 'Thymosin Alpha-1';

-- DSIP
UPDATE public.products SET
  name_i18n = '{"en": "DSIP"}',
  category_i18n = '{"en": "Anti-aging"}',
  description_i18n = '{"en": "<p><strong>DSIP (Delta Sleep-Inducing Peptide)</strong> is a neuromodulatory nonapeptide discovered for its ability to induce slow-wave sleep (delta). It is naturally present in the hypothalamus and limbic system.</p><p>This peptide regulates the sleep-wake cycle, modulates stress response via the HPA axis, and has antioxidant properties at the mitochondrial level.</p><p><strong>Main research areas:</strong></p><ul><li>Improved deep sleep quality.</li><li>Cortisol reduction and stress modulation.</li><li>Neuroprotective and antioxidant properties.</li></ul>"}'
WHERE name = 'DSIP';

-- Ipamorelin
UPDATE public.products SET
  name_i18n = '{"en": "Ipamorelin"}',
  category_i18n = '{"en": "Growth"}',
  description_i18n = '{"en": "<p><strong>Ipamorelin</strong> is a 3rd generation GH secretagogue pentapeptide, recognized as the first GHRP receptor agonist with selectivity comparable to GHRH.</p><p>Unlike GHRP-6 and GHRP-2, Ipamorelin does not stimulate ACTH or cortisol release, even at doses 200 times higher than the ED50 for GH.</p><p><strong>Main research areas:</strong></p><ul><li>Selective GH release without cortisol effects.</li><li>No significant appetite increase.</li><li>Improved bone density and muscle recovery.</li></ul>"}'
WHERE name = 'Ipamorelin';

-- Klow
UPDATE public.products SET
  name_i18n = '{"en": "Klow"}',
  category_i18n = '{"en": "Recovery"}',
  description_i18n = '{"en": "<p><strong>Klow Blend</strong> is a synergistic formulation combining four regenerative peptides: GHK-Cu (50mg), BPC-157 (10mg), TB-500 (10mg), and KPV (10mg).</p><p>This combination targets complementary pathways: tissue repair, inflammation modulation, angiogenesis, and extracellular matrix remodeling.</p><p><strong>Main research areas:</strong></p><ul><li>Tissue regeneration and accelerated healing.</li><li>Anti-inflammatory modulation via NF-κB inhibition.</li><li>Stimulation of collagen and elastin production.</li></ul>"}'
WHERE name = 'Klow';

-- SLU-PP-332
UPDATE public.products SET
  name_i18n = '{"en": "SLU-PP-332"}',
  category_i18n = '{"en": "Performance"}',
  description_i18n = '{"en": "<p><strong>SLU-PP-332</strong> is a pan-ERR (Estrogen-Related Receptor) agonist qualified as an \"exercise mimetic\". It targets all three ERRα, ERRβ, and ERRγ isoforms with preference for ERRα.</p><p>This compound activates an acute aerobic exercise genetic program, increasing mitochondrial function and cellular respiration in skeletal muscle.</p><p><strong>Main research areas:</strong></p><ul><li>Increased endurance and oxidative muscle fibers.</li><li>Improved fatty acid oxidation.</li><li>Reduced visceral adipose mass.</li></ul>"}'
WHERE name = 'SLU-PP-332';

-- SS-31
UPDATE public.products SET
  name_i18n = '{"en": "SS-31"}',
  category_i18n = '{"en": "Anti-aging"}',
  description_i18n = '{"en": "<p><strong>SS-31 (Elamipretide)</strong> is a synthetic tetrapeptide specifically targeting mitochondria. It interacts with cardiolipin of the inner mitochondrial membrane to stabilize the electron transport chain.</p><p>This peptide improves ATP production while reducing oxidative stress at the source, in the mitochondria themselves.</p><p><strong>Main research areas:</strong></p><ul><li>Restoration of mitochondrial bioenergetics.</li><li>Protection against cellular oxidative stress.</li><li>Improved age-related cardiac and muscle function.</li></ul>"}'
WHERE name = 'SS-31';

-- Tesamorelin
UPDATE public.products SET
  name_i18n = '{"en": "Tesamorelin"}',
  category_i18n = '{"en": "Weight Loss"}',
  description_i18n = '{"en": "<p><strong>Tesamorelin</strong> is a 44 amino acid synthetic analog of GHRH, modified by adding a trans-3-hexanoic group that protects it from DPP-4 degradation.</p><p>It is the only GHRH peptide approved by the FDA for treating HIV-associated lipodystrophy, with approximately 18% reduction in visceral fat.</p><p><strong>Main research areas:</strong></p><ul><li>Significant reduction of visceral adipose tissue.</li><li>Improved lipid profile and hepatic steatosis.</li><li>Nootropic effects and cognitive improvement.</li></ul>"}'
WHERE name = 'Tesamorelin';

-- ============================
-- 🏷️ CATÉGORIES - Mapping FR -> EN
-- ============================
-- Note: Les catégories sont stockées en FR dans la colonne 'category'
-- et la traduction EN dans 'category_i18n'
-- Mapping:
--   Récupération -> Recovery
--   Perte de poids -> Weight Loss
--   Croissance -> Growth
--   Anti-âge -> Anti-aging
--   Performance -> Performance
--   Bien-être -> Wellness
--   Hormonal -> Hormonal
--   Nootropique -> Nootropic
--   Cosmétique -> Cosmetic
--   Santé -> Health
