import Footer from "@/components/landing-page/footer";
import Header from "@/components/landing-page/header";
import Landing from "@/components/landing-page/landing";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Header />
      <Landing />
      <Footer />
    </div>
  );
}
