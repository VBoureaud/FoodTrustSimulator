HOW TO CYPRESS
========================

# PACKAGE.JSON

  add 
  ``"type": "module"``
  before launch  ``npm run cypress``

# Cypress config
  use cypress.config.cjs

  ```
    import { defineConfig } from "cypress";

    export default defineConfig({
      e2e: {
        baseUrl: 'http://localhost:8080'
      }
    })

  ```