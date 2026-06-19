import Reveal from './Reveal'

const items = [
    { src: '/shirt1.png', alt: 'Official Fest T-Shirt Design 1' },
    { src: '/shirt2.png', alt: 'Official Fest T-Shirt Design 2' },
    { src: '/Blue tee 1.png', alt: 'Blue T-Shirt' },
    { src: '/green tee 1.png', alt: 'Green T-Shirt' },
    { src: '/white tee.png', alt: 'White T-Shirt' },
    { src: '/hoodie 1.png', alt: 'Hoodie Design 1' },
    { src: '/hoodie 2.png', alt: 'Hoodie Design 2' },
    { src: '/Lanyard_Mockup_1.png', alt: 'Lanyard' },
    { src: '/Lanyard_Mockup_2.png', alt: 'Lanyard' },
    { src: '/bracelets.png', alt: 'Bracelets' },
    { src: '/tote bag.png', alt: 'Tote Bag' },
]

export default function Merch() {
    return (
        <section className="bg-white py-20 relative overflow-hidden">
            <div className="relative z-10">
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

                <div className="overflow-hidden">
                    <div className="flex gap-6 animate-marquee pause-on-hover w-max">
                        {[...items, ...items].map((item, i) => (
                            <div key={i} className="shrink-0 w-72 md:w-96">
                                <div className=" rounded-3xl p-4 md:p-6 flex items-center justify-center aspect-square">
                                    <img
                                        src={item.src}
                                        alt={item.alt}
                                        className="object-contain w-full h-full"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
