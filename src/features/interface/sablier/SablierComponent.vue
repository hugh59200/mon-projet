<template>
  <transition
    appear
    name="fade"
  >
    <div class="backdraw">
      <div class="spinner">
        <BasicText
          size="body-xl"
          class="loading"
        >
          Chargement
        </BasicText>
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts"></script>
<style lang="less" scoped>
  .backdraw.fade-enter-active {
    transition-delay: 20ms;
  }
  .backdraw.fade-leave-active {
    transition-delay: 200ms;
  }
  .backdraw {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.2);
    pointer-events: none;
    z-index: 1000;
  }

  .spinner {
    position: fixed;
    padding: 15px;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 30px;

    .loading {
      color: var(--primary-800);
      padding-bottom: 10px;
      display: block;
      max-width: 1000px;
      margin: 0;
      text-transform: uppercase;
    }
  }

  .spinner > div {
    width: 18px;
    height: 18px;
    background-color: var(--primary-800);
    border-radius: 100%;
    display: inline-block;
    -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  }

  .spinner .bounce1 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }

  .spinner .bounce2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }

  @-webkit-keyframes sk-bouncedelay {
    0%,
    80%,
    100% {
      -webkit-transform: scale(0);
    }

    40% {
      -webkit-transform: scale(1);
    }
  }

  @keyframes sk-bouncedelay {
    0%,
    80%,
    100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }

    40% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
</style>
