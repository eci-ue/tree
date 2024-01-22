import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import jsx from "@vitejs/plugin-vue-jsx";

export default defineConfig({
  resolve: {
    extensions: [".ts", ".vue", ".js", ".tsx"],
    alias: {
      "src/": `${path.resolve(__dirname, "src")}/`,
      "test/": `${path.resolve(__dirname, "test")}/`,
      "types/": `${path.resolve(__dirname, "types")}/`,
    },
  },
  plugins: [vue(), jsx()],
  css: {
    preprocessorOptions: {
      css: {
        charset: false
      },
      scss: {
        additionalData: "",
      }
    }
  },
  build: {
    target: "modules",
    polyfillModulePreload: false,
    lib: {
      entry: "src/components/index",
      name: "tree",
      formats: ["es"],
      fileName: "tree"
    },
    cssCodeSplit: true,
    sourcemap: true,
    manifest: false,
    rollupOptions: {
      external: [
        /^vue/i,
        /^lodash/i,
        /^ant/i,
        /^@ant-design/i,
        /^@fengqiaogang/i
      ],
      output: {
        inlineDynamicImports: true
      }
    }
  }
})
