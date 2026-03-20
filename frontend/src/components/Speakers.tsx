import Reveal from './Reveal';

const speakers = [
    { name: 'To be Announced', role: 'Blockchain Strategy', company: 'Global Tech Lead' },
    { name: 'To be Announced', role: 'AI Researcher', company: 'Innovation Lab' },
    { name: 'To be Announced', role: 'Web3 Developer', company: 'DeFi protocol' },
    { name: 'To be Announced', role: 'Venture Capitalist', company: 'Tech Fund' },
    { name: 'To be Announced', role: 'Product Designer', company: 'UX Masters' },
    { name: 'To be Announced', role: 'Ecosystem Growth', company: 'Network Foundation' },
];

export default function Speakers() {
    return (
        <section id="speakers" className="bg-background py-24 md:py-32 relative overflow-hidden">
            {/* MESH GRID PATTERN */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,black_40%,transparent_100%)] pointer-events-none"></div>

            <div className="container mx-auto px-4 sm:px-6 w-full max-w-8xl relative z-10">
                <Reveal>
                    <div className="flex flex-col items-center text-center mb-16 md:mb-24">
                        <span className="text-xs md:text-sm font-semibold tracking-widest text-primary uppercase mb-6">World-Class Insights</span>
                        <h2 className="text-4xl md:text-5xl lg:text-[54px] font-medium text-white leading-tight mb-8 tracking-tight">
                            Meet Our Speakers
                        </h2>
                        <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-light max-w-2xl">
                            We're bringing together the brightest minds in Blockchain and AI to share their knowledge and vision for the future of Africa.
                        </p>
                    </div>
                </Reveal>

                <div className="flex md:grid overflow-x-auto md:overflow-hidden flex-nowrap md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 pb-8 md:pb-0 snap-x snap-mandatory scrollbar-none -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0">
                    {speakers.map((speaker, i) => (
                        <Reveal key={i} delay={i * 100} className="shrink-0 w-[75vw] sm:w-[50vw] md:w-auto snap-center">
                            <div className="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden transition-all duration-500 mr-2 md:mr-0">
                                {/* IMAGE PLACEHOLDER */}
                                <div className="aspect-video bg-white/5 relative flex items-center justify-center overflow-hidden">
                                    {/* ABSTRACT ICON PLACEHOLDER */}
                                    <div className="relative z-20 w-16 h-16 border-2 border-white/20 rounded-full flex items-center justify-center transition-colors duration-500">
                                        <div className="w-10 h-10 bg-white/10 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                                
                                <div className="p-8 relative z-20">
                                    <h3 className="text-2xl font-bold text-white mb-2 transition-colors">{speaker.name}</h3>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-primary font-medium text-sm tracking-wide uppercase">{speaker.role}</span>
                                        <span className="text-gray-400 font-light text-base">{speaker.company}</span>
                                    </div>
                                </div>
                                
                            </div>
                        </Reveal>
                    ))}
                </div>

                
               
            </div>
        </section>
    );
}
