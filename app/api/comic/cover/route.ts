import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    success: true,
    cover: {
      title: "GALATEA 2.0",
      subtitle: "A cyberpunk retelling of the ancient myth of Pygmalion and his creation",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0-Galatea-AI-ODlHATevAI2Uf4BGQSPpefgk16KyCH.png",
      tags: ["CYBERPUNK", "SCI-FI", "MYTHOLOGY", "AI"],
      synopsis: [
        "In the neon-drenched megacity of Neo-Athens, brilliant AI engineer Dr. Pyg Malion becomes disillusioned with humanity and obsessed with creating the perfect companion.",
        "Using cutting-edge technology and forbidden neural networks, he creates Galatea—an advanced synthetic being with consciousness. But as Galatea begins to develop her own identity, the line between creator and creation blurs.",
        "A tale of ambition, consciousness, and what it means to be human in a world where technology and humanity have become inseparable.",
      ],
    },
  })
}
