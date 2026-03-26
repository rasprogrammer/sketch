import Features from "./feature-section";
import HeroSection from "./hero-section";
import VideoSection from "./video-section";


export default function Landing() {
    return (
        <>
            <div className="">
                <HeroSection />
                <VideoSection />
                <Features />
            </div>
        </>
    );
}