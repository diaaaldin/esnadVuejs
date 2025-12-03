<template>
    <div class="not-authenticated">
      <div class="message-container">
        <h1>Access Denied</h1>
        <p>You are not authenticated to view this page.</p>
        <button @click="goToLogin">Back to home</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      goToLogin() {
        this.$router.push({ name: "Login" });
      }
    }
  };
  </script>
  
  <style scoped>
  .not-authenticated {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f4f9f4; /* Light green background */
    color: #1b5e20; /* Dark green text */
    font-family: 'Arial', sans-serif;
  }
  
  .message-container {
    text-align: center;
    border: 2px solid #1b5e20; /* Dark green border */
    border-radius: 8px;
    padding: 40px;
    background-color: #ffffff; /* White background */
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  }
  
  .message-container h1 {
    font-size: 2.5em;
    margin-bottom: 20px;
    color: #1b5e20; /* Dark green text */
  }

  .message-container p {
    font-size: 1.2em;
    margin-bottom: 30px;
    color: #2e7d32; /* Slightly lighter green text */
  }
  
  .message-container button {
    background-color: #1b5e20; /* Dark green button */
    color: #ffffff; /* White text */
    border: none;
    padding: 12px 24px;
    font-size: 1.1em;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .message-container button:hover {
    background-color: #388e3c; /* Lighter green on hover */
  }
  </style>