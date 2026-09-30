import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { MobileCallBar } from "@/components/MobileCallBar";
import { Reveal } from "@/components/motion/Reveal";
import { RollLabel } from "@/components/motion/RollLabel";
import { WhyLuxen } from "@/components/sections/WhyLuxen";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { useBooking } from "@/components/BookingModal";
import { SEOHead } from "@/components/SEOHead";

const VIDEO_SRC =
  "https://assets.cdn.filesafe.space/myHH3DWgv1jOQx1drQO9/media/6abd1f5e1b644080e36e83f5.mp4";

const easeLux = [0.22, 1, 0.36, 1] as const;

/**
 * Each line lifts and blurs away on its own beat when playback starts, and
 * settles back the same way when it stops. Spread onto a motion element.
 */
const lift = (delay: number) => ({
  initial: { opacity: 0, y: 16, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -24, filter: "blur(6px)" },
  transition: { duration: 0.55, delay, ease: easeLux },
});

/** The promise in three words each, under the film. */
const PILLARS = [
  {
    k: "Partner",
    v: "Not a vendor",
    d: "You get one team that knows your system, not a ticket queue.",
  },
  {
    k: "System",
    v: "Not a website",
    d: "The site is the front door. Follow-up, booking, and reviews run behind it.",
  },
  {
    k: "Ongoing",
    v: "Not one-and-done",
    d: "Launch is the start of the work, which is when most agencies leave.",
  },
];

const WhyLuxenPage = () => {
  const { open: openBooking } = useBooking();

  return (
    <div id="top" className="relative min-h-screen bg-background">
      <SEOHead
        title="Why Luxen Digital — A Premium Technology Partner, Not Just a Web Design Company"
        description="Most web designers treat launch as the finish line. At Luxen Digital, it's where the partnership begins. Built for service businesses, designed to convert, with automation that works around the clock."
        canonical="/why-luxen"
        schemaJson={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "AboutPage",
              name: "Why Luxen Digital",
              description:
                "Luxen Digital is a premium technology partner for service businesses — building connected customer-acquisition systems with ongoing support.",
            },
            {
              "@type": "VideoObject",
              name: "Why Luxen Digital",
              description:
                "How Luxen Digital builds and runs customer-acquisition systems for service businesses.",
              contentUrl: VIDEO_SRC,
              uploadDate: "2026-09-30",
            },
          ],
        }}
      />
      <Navbar />

      <main>
        {/* Hero — the film is the page's opening image, and the copy sits on
            it rather than above it.

            The section is pushed clear of the fixed navbar rather than running
            under it: the bar was cropping the top of the frame, and the
            subject's head sits high enough that there is nothing to spare. */}
        <section className="relative isolate">
          {/* The navbar rides on the footage here, so the top of the frame
              gets its own scrim. Without it the light nav text lands on
              whatever the video happens to be showing. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-40 bg-gradient-to-b from-black/70 via-black/30 to-transparent"
          />
          <VideoPlayer
            src={VIDEO_SRC}
            title="Why Luxen Digital"
            className="h-[94svh] min-h-[560px] w-full"
            // A wide hero crops a 16:9 source hard. Biasing the crop upward
            // keeps the head in frame and takes the loss off the bottom,
            // which the copy covers anyway.
            videoClassName="object-[center_28%]"
            overlay={({ play, started, ended }) => (
              <div className="flex h-full flex-col justify-end px-6 pb-28 pt-28 sm:pb-32 lg:px-10">
                <div className="mx-auto w-full max-w-4xl">
                  <motion.p
                    {...lift(0)}
                    className="text-sm font-medium uppercase tracking-[0.25em] text-accent"
                  >
                    Why Luxen Digital
                  </motion.p>
                  <motion.h1
                    {...lift(0.06)}
                    className="mt-4 max-w-3xl font-display text-3xl font-medium tracking-tight text-balance text-white sm:text-4xl lg:text-5xl"
                  >
                    A premium technology partner, not just a web design company.
                  </motion.h1>
                  <motion.p
                    {...lift(0.12)}
                    className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg"
                  >
                    Most web designers treat launch as the finish line. For us
                    it is where the partnership begins — and this is the
                    shortest way to show you what that looks like.
                  </motion.p>

                  <motion.div
                    {...lift(0.18)}
                    className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
                  >
                    <button
                      onClick={play}
                      className="btn-gold group inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 text-base font-bold"
                    >
                      <Play className="h-5 w-5 fill-current" />
                      {/* "Resume" would be a lie at the end, where play
                          restarts from zero. */}
                      <RollLabel>
                        {ended
                          ? "Watch again"
                          : started
                            ? "Resume watching"
                            : "Play the film"}
                      </RollLabel>
                    </button>
                    {/* A hairline outline on video reads as unfinished. Give
                        it a glass body so it holds its own beside the gold. */}
                    <button
                      onClick={openBooking}
                      className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-md transition-colors duration-300 hover:border-white/40 hover:bg-white/20"
                    >
                      Book a Call
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </motion.div>
                </div>
              </div>
            )}
          />
        </section>

        {/* The promise, in three */}
        <section className="relative py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <Reveal>
              <ul className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
                {PILLARS.map((p) => (
                  <li key={p.k} className="bg-background p-6">
                    <p className="font-display text-xs font-medium uppercase tracking-[0.25em] text-accent">
                      {p.k}
                    </p>
                    <p className="mt-3 font-display text-lg font-medium text-foreground">
                      {p.v}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {p.d}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <WhyLuxen />
        <FinalCTA />
      </main>

      <Footer />
      <MobileCallBar />
    </div>
  );
};

export default WhyLuxenPage;
