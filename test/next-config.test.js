const nextConfig = module.require("../next.config.js");

describe("Next.js API rewrite", () => {
  test("runs API rewrites after local filesystem routes", async () => {
    const rewrites = await nextConfig.rewrites();

    expect(rewrites.afterFiles).toEqual([
      expect.objectContaining({
        source: "/api/:path*",
        destination: expect.stringMatching(/\/api\/:path\*$/),
      }),
    ]);
    expect(rewrites.beforeFiles).toBeUndefined();
  });
});
