<template>
  <div class="noData">
    <div class="svg-container">
      <img
        class="image"
        src="@designSystem/fondation/img/happy_announcement.svg?url"
      />
      <BasicText
        class="overlay-text"
        color="white"
        weight="light"
      >
        <slot name="content"></slot>
      </BasicText>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less">
  .noData {
    background-color: #f0f3f5;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;

    .svg-container {
      position: relative;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 20px;
      background-color: var(--secondary-800);
      padding: 24px 48px;
      max-width: 60%;
      min-height: 180px;

      @media (max-width: @breakpoint-mobile) {
        max-width: 80%;
      }

      @media (max-width: @breakpoint-tablet) {
        max-width: 80%;
      }
    }

    .image {
      position: absolute;
      object-fit: cover;
      width: 100%;
      height: 100%;
    }

    .overlay-text {
      text-align: center;
      pointer-events: none;
      z-index: 100;
      max-width: 80%;
    }
  }
</style>
