import { defineConfig } from 'cypress'
import * as dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const updatedConfig = {
        ...config,
        env: {
          ...config.env,
          BASE_URL: process.env.BASE_URL || 'localhost:3000/',
          POC_PASSWORD: process.env.POC_PASSWORD,
        },
      }
      return updatedConfig
    },
  },
})
