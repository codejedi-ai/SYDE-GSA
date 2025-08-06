import Image from "next/image"

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col">

      {/* About Header */}
      <div className="w-full bg-cyber-darker border-y-4 border-cyber-blue/30 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-cyber mb-4 neon-text text-center">ABOUT THE COMIC</h1>
          <p className="text-xl text-cyber-blue text-center max-w-2xl mx-auto">
            The story behind Galatea 2.0 and its creators
          </p>
        </div>
      </div>
      {/* About Content */}
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div className="comic-panel relative aspect-square">
              <Image src="/placeholder.svg?height=600&width=600" alt="Comic Studio" fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-3xl font-cyber mb-6 neon-text">THE SUMMARY</h2>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Galatea 2.0 is a cyberpunk reimagining of the ancient Greek myth of Pygmalion and Galatea. In the
                  original myth, Pygmalion was a sculptor who fell in love with a statue he created, which was then
                  brought to life by Aphrodite.
                </p>
                <p className="text-gray-300">
                  Our version transports this tale to the neon-drenched streets of Neo-Athens in 2089, where Dr. Pyg
                  Malion is a brilliant but reclusive AI engineer who creates Galatea, an advanced synthetic being with
                  true consciousness.
                </p>
                <p className="text-gray-300">
                  The story explores themes of creation, identity, free will, and what it truly means to be human in a
                  world where the line between technology and humanity has blurred.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-cyber mb-6 neon-text-pink">THE CREATORS</h2>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Galatea 2.0 is a collaborative project created by a team of artists, writers, and developers
                  passionate about cyberpunk aesthetics and exploring the philosophical implications of artificial
                  intelligence and consciousness.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="bg-cyber-darker p-4 rounded-lg border border-cyber-blue/30">
                    <h3 className="text-lg font-semibold text-cyber-blue mb-2">Story & Writing</h3>
                    <p className="text-gray-400">Alex Chen & Morgan Rivera</p>
                  </div>
                  <div className="bg-cyber-darker p-4 rounded-lg border border-cyber-pink/30">
                    <h3 className="text-lg font-semibold text-cyber-pink mb-2">Art & Design</h3>
                    <p className="text-gray-400">Jamie Kowalski & Sam Patel</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="comic-panel relative aspect-square order-1 md:order-2">
              <Image src="/placeholder.svg?height=600&width=600" alt="Comic Creators" fill className="object-cover" />
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-cyber mb-6 neon-text text-center">THE INSPIRATION</h2>
            <div className="comic-panel p-8">
              <p className="text-gray-300 mb-4">
                Galatea 2.0 draws inspiration from classic cyberpunk works like Blade Runner, Ghost in the Shell, and
                Neuromancer, as well as modern explorations of AI consciousness such as Ex Machina and Westworld.
              </p>
              <p className="text-gray-300">
                By reimagining an ancient myth through the lens of cyberpunk, we hope to create a story that feels both
                timeless and urgently relevant to our rapidly evolving technological landscape.
              </p>
            </div>          </div>
        </div>
      </div>
    </main>
  )
}
