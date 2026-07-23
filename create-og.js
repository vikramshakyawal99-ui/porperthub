const sharp = require("sharp");

sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 3,
    background: { r: 255, g: 255, b: 255 },
  },
})
  .composite([
    {
      input: Buffer.from(
        `<svg width="1200" height="630">
          <text x="180" y="260"
          font-size="80"
          font-family="Arial"
          fill="black">
          PropertyHub
          </text>

          <text x="180" y="370"
          font-size="50"
          font-family="Arial"
          fill="black">
          Premium Properties in Jaipur
          </text>
        </svg>`
      ),
    },
  ])
  .jpeg()
  .toFile("public/og-image.jpg");

