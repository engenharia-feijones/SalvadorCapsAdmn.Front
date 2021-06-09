<template>
  <div class="social-relative-container">
    <div class="social-container">
      <div class="icon-render" v-for="(icon, index) in menuIcons" :key="index" @click="iconRedirect(icon.url)">
        
        <v-img :src="icon.img" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "IconNavbar",
  data: () => ({
    menuIcons: [
      {
        img: require("@/assets/icon-facebook.png"),
        url: "https://www.facebook.com/Salvador-Caps-1719996011586273/",
      },
      {
        img: require("@/assets/icon-instagram.png"),
        url: "https://www.instagram.com/salvadorcaps/",
      },
      {
        img: require("@/assets/icon-whatsApp.png"),
        url: "https://api.whatsapp.com/send?phone=+557199208-9249",
      },
      // { img: require("@/assets/icon-sacola.png"), url: "" },
    ],
  }),

  methods: {
    iconRedirect(url) {
      if (url) {
        window.location.href = url;
      }
    },
  },
};
</script>

<style scoped>
.social-relative-container {
  position: relative;
  padding: 0.1em;
}

.social-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  /* transform: translateY(-9em); TODO: usar essa linha quando a sacola estiver usuavel  */
  transform: translateY(-6.5em); 
  right: 0;
}

.social-container .icon-render {
  width: 1.8em;
  padding: 0.1em;
  margin: .22em 0.1em;
  transition: all 0.3s;
}

.icon-render:not(:last-of-type):hover {
  transform: translateX(-2px);
  border-radius: 50px;
}

@media screen and (min-width: 768px) {
  .social-container {
    flex-direction: row;
    transform: translateY(-2.5em);
    font-size: 1.8rem;
  }

  .social-container .icon-render {
    width: 2em;
  }

  .social-container .icon-render:not(:last-of-type):hover {
    transform: translateY(2px);
  }
}
</style>