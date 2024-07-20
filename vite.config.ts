/// <reference types="vitest" />
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
	build : {
		lib : {
			entry: resolve(__dirname, 'src/index.ts'),
			name : "canvas-color-tracker",
			fileName(format) {
				if (format === 'umd')
					return "canvas-color-tracker.js"
				return "canvas-color-tracker.mjs"
			},
		},
	},
	plugins: [dts()]
})
