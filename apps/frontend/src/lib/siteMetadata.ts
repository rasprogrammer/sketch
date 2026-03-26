import { envSiteUrl } from "@/config";


if (!envSiteUrl) {
  throw new Error(
    '❌ NEXT_PUBLIC_SITE_URL is missing or empty! Check your .env file.',
  );
}

const siteMetadata = {
    title: "SKETCH",
    description: "A real-time collaborative sketching tool for teams to brainstorm, draw, and create together.",
    header: "SKETCH",
    slogan: "Sketch Together, Think Better",
    developer: "rasprogrammer",
    siteUrl: envSiteUrl,
    language: "en-US",
    locale: "en-US",
    socialBanner: "",

    github: "",
    linkedIn: "",
    twitter: "",

    email: "22rajeev22@gmail.com"

};

export default siteMetadata;