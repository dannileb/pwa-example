import {
  createAppleSplashScreens,
  defineConfig,
  minimal2023Preset as preset,
} from "@vite-pwa/assets-generator/config";

export default defineConfig({
  headLinkOptions: {
    preset: "2023",
  },
  preset: {
    ...preset,
    appleSplashScreens: createAppleSplashScreens({
      padding: 0.3,
      resizeOptions: { background: "white", fit: "contain" },
      darkResizeOptions: { background: "black" },
    }),
  },
  images: ["public/favicon.svg"],
});
