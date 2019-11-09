<template>
  <div class="container has-background-grey-light">
  <section class="hero is-primary">
  <div class="hero-body">
    <div class="container">
      <h1 class="title"> The Daily Dog</h1>
     </div>
  </div>
</section>

<div class="columns is-desktop">
  <div class="column is-horizontal-center">
   <img :src="dog_img" :alt="dog_breed">
  </div>
  
<div class="column">
<div class="card">
  <header class="card-header is-primary">
   <h1 class="card-header-title">{{ dog_breed }}</h1>
  </header>
  <div class="card-content ">
    <div class="content">
        <h2 class="subtitle">{{ dog_temperament }}</h2>
              <ul class="a">
        <li>Weight: {{ dog_weight }} </li>
<li>Height: {{ dog_height }} </li>
<li>Life span: {{ dog_life_span }} </li>
<li>Bred for: {{ dog_bred_for }} </li>
        </ul>
     </div>
  </div>
</div>
 </div>
</div>
<footer class="footer has-background-primary">
  <div class="content has-text-centered">
    <p>
      <b>The Daily Dog</b>: made with &#x2764; by <a href="https://dizid.com">Frans</a> for Elin, 2018
    </p>
  </div>
</footer>
 </div>
 </template>

<script>
    import axios from "axios"
    require('dotenv').config()
    export default {
        name: 'DailyDog',
        data () {
            return {
                dog_breed: "",
                dog_img: "",
                dog_weight: "",
                dog_height: "",
                dog_life_span: "",
                dog_bred_for: "",
                dog_temperament: "",
                data: {color: '#673AB7'}
           }
        },
        mounted() {
            let the_url = "https://api.thedogapi.com/v1/images/search?size=large&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=1"
            axios({ method: "GET", "url": the_url, headers: { "content-type": "application/json",
            "X-Api-Key": process.env.DOG_KEY},         
            }).then(result => {
                this.dog_breed = result.data[0].breeds[0].name
                this.dog_img = result.data[0].url
                this.dog_weight = result.data[0].breeds[0].weight.metric
                this.dog_height = result.data[0].breeds[0].height.metric
                this.dog_life_span = result.data[0].breeds[0].life_span
                this.dog_bred_for = result.data[0].breeds[0].bred_for
                this.dog_temperament = result.data[0].breeds[0].temperament

            }, error => {
                console.error(error)
            });
        }
     }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.is-horizontal-center {
  justify-content: center;
}
img {
  display: block;
  width: 100%;
  height: auto;
}

</style>
