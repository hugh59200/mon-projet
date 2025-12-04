<template>
  <div class="essentials">
    <BasicText
      size="h4"
      weight="bold"
      class="essentials__title"
    >
      Protocoles & Recommandations
    </BasicText>

    <div class="essentials__grid">
      <div class="info-card">
        <div class="info-card__icon">
          <BasicIconNext name="Snowflake" :size="24" />
        </div>
        <div class="info-card__content">
          <BasicText
            size="body-l"
            weight="bold"
            color="secondary-900"
          >
            Conservation
          </BasicText>
          <BasicText
            size="body-s"
            color="neutral-600"
            class="info-card__text"
          >
            <strong>Lyophilisé (Poudre) :</strong>
            Stocker au congélateur (-20°C) pour une durée optimale (jusqu'à 36 mois).
            <br />
            <strong>Reconstitué :</strong>
            À conserver impérativement au réfrigérateur (2-8°C) et utiliser rapidement.
          </BasicText>
        </div>
      </div>

      <div class="info-card">
        <div class="info-card__icon">
          <BasicIconNext name="Droplet" :size="24" />
        </div>
        <div class="info-card__content">
          <BasicText
            size="body-l"
            weight="bold"
            color="secondary-900"
          >
            Reconstitution
          </BasicText>
          <BasicText
            size="body-s"
            color="neutral-600"
            class="info-card__text"
          >
            Il est recommandé d'utiliser de l'
            <strong>Eau Bactériostatique</strong>
            pour reconstituer vos peptides afin de garantir la stérilité et la stabilité de la
            solution. Manipulez avec précaution.
          </BasicText>
        </div>
      </div>

      <div class="info-card">
        <div class="info-card__icon">
          <BasicIconNext name="FlaskRound" :size="24" />
        </div>
        <div class="info-card__content">
          <BasicText
            size="body-l"
            weight="bold"
            color="secondary-900"
          >
            Usage Recherche
          </BasicText>
          <BasicText
            size="body-s"
            color="neutral-600"
            class="info-card__text"
          >
            Utilisez toujours du matériel stérile (seringues, tampons d'alcool). Ce produit est
            destiné uniquement à l'analyse et à la recherche en laboratoire.
          </BasicText>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
  .essentials {
    width: 100%;
    margin-top: 10px;

    &__title {
      /* Style identique au titre précédent pour la cohérence */
      border-left: 4px solid var(--primary-500);
      padding-left: 16px;
      margin-bottom: 24px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 1.1rem !important;
      color: var(--secondary-900);
      display: flex;
      align-items: center;
      height: 24px;
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }
  }

  .info-card {
    background: white;
    border: 1px solid @neutral-200;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    gap: 16px;
    align-items: flex-start;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      /* ✅ CORRECTION ICI : On utilise rgba() avec la variable CSS -rgb */
      border-color: rgba(var(--primary-500-rgb), 0.3);
    }

    &__icon {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      /* ✅ CORRECTION ICI : Idem, remplacement de fade() par rgba() */
      background: rgba(var(--primary-500-rgb), 0.1);

      color: var(--primary-700);
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: 20px;
        height: 20px;
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    &__text {
      line-height: 1.5;

      strong {
        color: var(--secondary-900);
        font-weight: 600;
      }
    }
  }
</style>
