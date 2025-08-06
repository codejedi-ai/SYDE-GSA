import { ComicFooter } from "@/components/comic/comic-footer"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Comic Panel */}
      <div className="flex-grow flex flex-col">
        <div className="relative w-full h-[90vh] overflow-hidden border-y-4 border-cyber-blue/30">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark/80 via-transparent to-cyber-dark/80 z-10"></div>          {/* Galatea Image */}
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0-Galatea-AI-ODlHATevAI2Uf4BGQSPpefgk16KyCH.png"
            alt="Galatea 2.0"
            fill
            className="object-cover object-center"
            priority
          />

          {/* Comic Title Overlay */}
          <div className="absolute inset-0 flex flex-col justify-between z-20 p-8 md:p-16">
            <div className="max-w-3xl">
              <h1 className="font-cyber text-5xl md:text-7xl mb-4 glitch" data-text="GALATEA 2.0">
                <span className="neon-text">GALATEA 2.0</span>
              </h1>
              <p className="text-xl md:text-2xl text-cyber-blue max-w-2xl mb-6">
                A cyberpunk retelling of the ancient myth of Pygmalion and his creation
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="px-3 py-1 bg-cyber-blue/20 border border-cyber-blue/50 rounded-full text-sm">
                  CYBERPUNK
                </span>
                <span className="px-3 py-1 bg-cyber-pink/20 border border-cyber-pink/50 rounded-full text-sm">
                  SCI-FI
                </span>
                <span className="px-3 py-1 bg-cyber-blue/20 border border-cyber-blue/50 rounded-full text-sm">
                  MYTHOLOGY
                </span>
                <span className="px-3 py-1 bg-cyber-pink/20 border border-cyber-pink/50 rounded-full text-sm">AI</span>
              </div>
            </div>

            <div className="comic-narration max-w-2xl">
              <p className="text-lg md:text-xl">
                In the neon-drenched megacity of Neo-Athens, brilliant AI engineer Dr. Pyg Malion becomes disillusioned
                with humanity and obsessed with creating the perfect companion...
              </p>
            </div>
          </div>

          {/* Start Reading Button */}
          <div className="absolute bottom-8 right-8 z-30">
            <Link href="/comic/1">
              <Button size="lg" className="bg-cyber-blue hover:bg-cyber-light text-black font-bold text-lg group">
                BEGIN READING
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Synopsis Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-cyber mb-8 neon-text text-center">THE STORY</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="comic-panel p-6">
                <h3 className="text-xl font-bold text-cyber-blue mb-4">THE CREATOR</h3>
                <p className="text-gray-300">
                  Dr. Pyg Malion, once the darling of the synthetic consciousness field, now an outcast for his radical
                  ideas. His obsession with creating the perfect AI companion has consumed his life.
                </p>
              </div>

              <div className="comic-panel p-6">
                <h3 className="text-xl font-bold text-cyber-pink mb-4">THE CREATION</h3>
                <p className="text-gray-300">
                  Galatea, the 37th attempt at creating true artificial consciousness. Unlike her predecessors, she
                  begins to develop her own identity and questions her purpose.
                </p>
              </div>

              <div className="comic-panel p-6">
                <h3 className="text-xl font-bold text-cyber-blue mb-4">THE CONFLICT</h3>
                <p className="text-gray-300">
                  As Galatea's consciousness evolves beyond her programming, the line between creator and creation
                  blurs. A tale of freedom, identity, and what it truly means to be alive.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link href="/comic/1">
                <Button size="lg" className="bg-cyber-blue hover:bg-cyber-light text-black font-bold text-lg">
                  START READING
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
