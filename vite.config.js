import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	base: "/my-react-app/", // Added trailing slash (critical for GitHub Pages)
	plugins: [react()],
	build: {
		outDir: "dist", // Explicitly set output directory
		emptyOutDir: true, // Clears dist folder before build
	},
});
