import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/footer';
import { Calendar, Heart } from 'lucide-react';
import memoriesData from '@/data/memories.json';

interface Memory {
  id: string;
  title: string;
  description: string;
  term: string;
  date: string;
  image_url: string | null;
  created_at: string;
}

interface MemoriesByTerm {
  [term: string]: Memory[];
}


function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function groupMemoriesByTerm(memories: Memory[]): MemoriesByTerm {
  return memories.reduce((acc: MemoriesByTerm, memory) => {
    if (!acc[memory.term]) {
      acc[memory.term] = [];
    }
    acc[memory.term].push(memory);
    return acc;
  }, {});
}

function sortTerms(terms: string[]): string[] {
  const termOrder: { [key: string]: number } = {
    'Winter': 1,
    'Spring': 2,
    'Summer': 3,
    'Fall': 4
  };

  return terms.sort((a, b) => {
    const [seasonA, yearA] = a.split(' ');
    const [seasonB, yearB] = b.split(' ');

    const yearDiff = parseInt(yearB) - parseInt(yearA);
    if (yearDiff !== 0) return yearDiff;

    return (termOrder[seasonB] || 0) - (termOrder[seasonA] || 0);
  });
}

export default function MemoriesPage() {
  const allMemories: Memory[] = memoriesData;
  const memoriesByTerm = groupMemoriesByTerm(allMemories);
  const sortedTerms = sortTerms(Object.keys(memoriesByTerm));

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">
              <span className="text-yellow-400">InSYDErs</span> Memories
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Celebrating our journey together, term by term
            </p>
          </div>

          {sortedTerms.length > 0 ? (
            <div className="space-y-16">
              {sortedTerms.map((term) => (
                <section key={term} className="scroll-mt-24">
                  <div className="mb-8">
                    <h2 className="text-4xl font-bold text-black mb-2 flex items-center gap-3">
                      <Heart className="w-8 h-8 text-yellow-400" />
                      {term}
                    </h2>
                    <div className="h-1 w-24 bg-yellow-400 rounded-full"></div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {memoriesByTerm[term].map((memory) => (
                      <div
                        key={memory.id}
                        className="bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-yellow-400 transition-all hover:shadow-lg"
                      >
                        {memory.image_url ? (
                          <div className="relative h-48 w-full">
                            <img
                              src={memory.image_url}
                              alt={memory.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="relative h-48 w-full bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
                            <Heart className="w-16 h-16 text-yellow-400" />
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-2xl font-bold text-black mb-3">{memory.title}</h3>
                          <div className="flex items-center gap-2 text-gray-700 mb-4">
                            <Calendar className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm">{formatDate(memory.date)}</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{memory.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <section className="text-center">
              <div className="bg-gray-50 rounded-xl p-12 border-2 border-gray-200">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-black mb-4">No Memories Yet</h2>
                <p className="text-gray-600">
                  Check back soon as we build our collection of amazing memories together!
                </p>
              </div>
            </section>
          )}

          <section className="mt-16 bg-gradient-to-br from-black via-gray-900 to-black rounded-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Share Your Memory</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Have photos or stories from an InSYDErs event? We'd love to add them to our memories!
            </p>
            <a
              href="mailto:syde-gsa@uwaterloo.ca?subject=Memory Submission"
              className="inline-block px-8 py-4 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-300 transition-all"
            >
              Submit a Memory
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
