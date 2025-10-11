import { useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FaUser, FaArrowRight } from "react-icons/fa";
import mainBgImage from "@/assets/island.png";

const customFontStyle = {
  fontFamily: "'Neue Montreal Regular', sans-serif",
  fontWeight: 600,
  fontStyle: "normal",
};

const customFontStyle2 = {
  fontFamily: "'Travel October', sans-serif",
  fontWeight: 600,
  fontStyle: "normal",
};

export default function AboutUs() {
  // ✅ Create a reference for the section to scroll to
  const aboutSectionRef = useRef(null);

  // ✅ Scroll function
  const handleScroll = () => {
    aboutSectionRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const timelineVariants = {
    hidden: { opacity: 0, x: 0 },
    visible: (i) => ({
      opacity: 1,
      x: i % 2 === 0 ? -20 : 20,
      transition: { duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <div className="min-h-screen w-full bg-white font-sans pt-[104px] text-gray-800 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div
        className="absolute top-0 left-0 w-full h-full opacity-5 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d1d5db' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-screen bg-cover bg-center flex items-center justify-center text-white overflow-hidden"
        style={{ backgroundImage: `url(${mainBgImage})` }}
      >
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/40 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/30 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-black/30 via-transparent to-black/30 z-0"></div>

        {/* Hero Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <h1
            style={customFontStyle2}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
          >
            About Travel
          </h1>
          <p
            style={customFontStyle}
            className="text-base md:text-lg lg:text-xl max-w-2xl mx-auto mb-6 leading-relaxed"
          >
            All the trips around the world are a great pleasure and happiness
            for anyone, enjoy the sights when you travel the world. Travel
            safely and without worries, get your trip and explore the paradises
            of the world.
          </p>

          {/* ✅ Scroll button */}
          <motion.button
            onClick={handleScroll}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition flex items-center space-x-2 mx-auto"
          >
            <span>Explore Travel</span>
            <FaArrowRight />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* ✅ Section to Scroll To */}
      <div
        ref={aboutSectionRef}
        className="w-full max-w-4xl mx-auto px-4 py-16 relative z-10"
      >
        {/* About Content Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={cardVariants}>
            <Card className="border-0 shadow-lg bg-white relative overflow-hidden">
              <CardContent className="pt-10 pb-16 px-6">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="md:w-1/2"
                  >
                    <img
                      src={mainBgImage}
                      alt="Beautiful tropical island"
                      className="rounded-lg shadow-md w-full h-auto object-cover"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="md:w-1/2"
                  >
                    <h2
                      style={customFontStyle2}
                      className="text-3xl font-bold mb-4"
                    >
                      Enjoy The Beauty Of The World
                    </h2>
                    <p
                      style={customFontStyle}
                      className="text-muted-foreground mb-4 leading-relaxed"
                    >
                      At our core, we believe that travel is more than just
                      visiting places — it's about experiencing cultures,
                      connecting with nature, and creating memories that last a
                      lifetime.
                    </p>
                    <p
                      style={customFontStyle}
                      className="text-muted-foreground mb-6 leading-relaxed"
                    >
                      Whether you're chasing sunsets on remote beaches or
                      trekking through lush jungles, we're here to make sure
                      every moment counts — safely, sustainably, and with a
                      smile.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-[#6355B5] text-white rounded-md hover:bg-[#524595] transition"
                    >
                      Start Your Journey
                    </motion.button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <Separator className="my-12" />

        {/* Why Choose Us Timeline Section */}
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#6355B5] md:left-1/2 md:-translate-x-1/2"></div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12 md:space-y-16"
          >
            {[
              {
                title: "Expert Local Guides",
                desc: "Our team knows the hidden gems and local secrets that turn good trips into unforgettable adventures.",
              },
              {
                title: "Safe & Sustainable",
                desc: "We prioritize your safety and the planet's health — eco-friendly practices built into every itinerary.",
              },
              {
                title: "Tailored Experiences",
                desc: "No two travelers are alike. We customize every detail to match your pace, interests, and dreams.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={timelineVariants}
                className={`relative flex ${
                  index % 2 === 0
                    ? "md:flex-row"
                    : "md:flex-row-reverse"
                } items-center`}
              >
                <div className="absolute left-4 w-6 h-6 rounded-full bg-[#6355B5] border-4 border-white z-10 md:left-1/2 md:-translate-x-1/2"></div>

                <div
                  className={`w-full md:w-5/12 ${
                    index % 2 === 0
                      ? "md:pr-16 md:pl-12"
                      : "md:pl-16 md:pr-12 md:ml-auto"
                  }`}
                >
                  <Card className="border-0 shadow-md bg-slate-50 p-6 h-full">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full bg-[#6355B5] flex items-center justify-center flex-shrink-0">
                        <FaUser className="text-white" />
                      </div>
                      <div>
                        <h3
                          style={customFontStyle2}
                          className="font-medium mb-2"
                        >
                          {item.title}
                        </h3>
                        <p
                          style={customFontStyle}
                          className="text-muted-foreground text-sm"
                        >
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
