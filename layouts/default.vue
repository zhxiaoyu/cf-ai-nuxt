<template>
    <div class="wrapper">
      <aside class="sidebar">
        <ul>
          <li><nuxt-link to="/">Home</nuxt-link></li>
          <li><nuxt-link to="/text-to-image">Text to Image</nuxt-link></li>
          <li><nuxt-link to="/text-generation">Text Generation</nuxt-link></li>
          <li><nuxt-link to="/translation">Translation</nuxt-link></li>
        </ul>
      </aside>
      <main class="content">
        <NuxtPage />
      </main>
    </div>
  </template>
  
  <style>
  .wrapper {
    display: flex;
  }
  .sidebar {
    width: 250px;
    background: #2c3e50;
    color: white;
    height: 100vh;
    padding: 1em;
  }
  .sidebar ul {
    list-style: none;
    padding: 0;
  }
  .sidebar ul li {
    margin: 1em 0;
  }
  .sidebar ul li a {
    color: white;
    text-decoration: none;
  }
  .content {
    flex: 1;
    padding: 2em;
  }
  </style>
  