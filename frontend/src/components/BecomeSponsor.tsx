import Reveal from './Reveal';
import { HiMail } from 'react-icons/hi';

export default function BecomeSponsor() {
    return (
        <section id="sponsor" className="py-24 bg-white ">
            <div className="container mx-auto px-4 max-w-7xl text-center">
                <Reveal>
                    <div className="flex flex-col items-center">
                        <span className="text-sm font-semibold tracking-widest text-primary uppercase mb-6">Partnership</span>
                        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
                            Become a Sponsor
                        </h2>
                        <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-12 font-light max-w-2xl mx-auto">
                            Join us in shaping the future of African technology. Connect with innovators, founders, and talent at the premier Blockchain & AI festival in North-Central Nigeria.
                        </p>
                        
                        <div className="flex flex-col items-center gap-6">
                            <a 
                                href="mailto:partnerships@benueblockchainfest.com"
                                className="flex items-center gap-3 bg-secondary hover:bg-primary text-white font-bold py-4 px-12 rounded-full transition-all duration-300 transform hover:-translate-y-1 shadow-xl"
                            >
                                <HiMail className="text-2xl" />
                                Sponsor Benue Fest
                            </a>
                            </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}


