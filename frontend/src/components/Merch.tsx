import Reveal from './Reveal'

export default function Merch() {
    return (
        <section className="bg-white py-20 relative overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                <Reveal>
                    <div className="text-center mb-16">
                        <span className="text-sm font-semibold tracking-widest text-red uppercase mb-4 block">Official Gear</span>
                        <h2 className="text-4xl md:text-5xl font-heading text-gray-900 mb-6">
                            Exclusive Merch
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto font-light">
                            Rep the movement. Get your hands on the official Benue Blockchain & AI Fest merchandise.
                        </p>
                    </div>
                </Reveal>

                <div className="flex md:grid md:grid-cols-2 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-none gap-4 md:gap-10 lg:gap-16 max-w-5xl mx-auto pb-8 md:pb-0 px-4 md:px-0 -mx-4 md:mx-auto">
                    {/* START PADDING MOBILE */}
                    <div className="shrink-0 w-0 md:hidden"></div>

                    {/* SHIRT 1 */}
                    <div className="shrink-0 w-[75vw] md:w-auto snap-start">
                        <Reveal delay={100}>
                            <div className="group relative bg-gray-50 rounded-3xl p-2 md:p-8 flex flex-col items-center transition-all duration-300 overflow-visible">
                                <div className="relative w-full aspect-square mb-2 md:mb-8 overflow-visible">
                                    <img
                                        src="/shirt1.png"
                                        alt="Official Fest T-Shirt Design 1"
                                        className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500 scale-[1.4] md:scale-100"
                                    />
                                </div>
                             </div>
                        </Reveal>
                    </div>

                    {/* SHIRT 2 */}
                    <div className="shrink-0 w-[75vw] md:w-auto snap-start">
                        <Reveal delay={200}>
                            <div className="group relative bg-gray-50 rounded-3xl p-2 md:p-8 flex flex-col items-center transition-all duration-300 overflow-visible">
                                <div className="relative w-full aspect-square mb-2 md:mb-8 overflow-visible">
                                    <img
                                        src="/shirt2.png"
                                        alt="Official Fest T-Shirt Design 2"
                                        className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500 scale-[1.4] md:scale-100"
                                    />
                                </div>
 
                            </div>
                        </Reveal>
                    </div>

                    {/* END PADDING MOBILE */}
                    <div className="shrink-0 w-4 md:hidden"></div>
                </div>
            </div>
        </section>
    )
}
