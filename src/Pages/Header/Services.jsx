import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Ship,
  MapPin,
  Car,
  Info,
  Headphones,
  CheckCircle,
  Waves,
  Plane,
  Compass,
  Star,
} from "lucide-react";

// Import images
import mainBgImage from '@/assets/island.png';

export default function Services() {
  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <div
        className="relative h-[400px] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: `url(${mainBgImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text">
            Our Services
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            From seamless ferry bookings to curated island adventures, we provide end-to-end travel solutions designed to make your Andaman trip unforgettable.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="w-full h-20"
            preserveAspectRatio="none"
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,192L30,197.3C60,203,120,213,180,197.3C240,181,300,149,360,154.7C420,160,480,203,540,202.7C600,203,660,160,720,154.7C780,149,840,181,900,186.7C960,192,1020,171,1080,154.7C1140,139,1200,128,1260,133.3C1320,139,1380,160,1410,170.7L1440,181.3L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 py-12">
        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Ship,
              title: "Ferry Booking",
              desc: "Real-time availability checking across all major operators including Nautika, Green Ocean, and private ferries.",
              features: [
                "Instant booking confirmation",
                "Fare comparison engine",
                "Security screening guidance",
                "Government ferry schedules"
              ]
            },
            {
              icon: Car,
              title: "Hotel Booking",
              desc: "Curated accommodation options with best price guarantee and verified guest reviews.",
              features: [
                "Verified guest reviews",
                "Best price guarantee",
                "24/7 reservation support",
                "Curated accommodation options"
              ]
            },
            {
              icon: Waves,
              title: "Activities Booking",
              desc: "Adventure packages, island hopping tours, cultural experiences, and photography excursions.",
              features: [
                "Certified scuba diving packages",
                "Guided night kayaking",
                "Jet skiing and parasailing",
                "Full-day island hopping tours"
              ]
            }
          ].map((service, index) => (
            <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <service.icon className="text-blue-500 text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-muted-foreground mb-4">{service.desc}</p>
                <ul className="space-y-2 text-left">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-10" />

        {/* Additional Services */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {[
            {
              icon: Info,
              title: "Travel Information Hub",
              desc: "Trusted by over 100,000+ travelers, our info hub helps you plan every detail of your trip.",
              color: "purple"
            },
            {
              icon: Headphones,
              title: "24/7 Customer Support",
              desc: "Round-the-clock assistance via live chat, phone (+91 XXXXX XXXXX), and email.",
              color: "rose"
            }
          ].map((service, index) => (
            <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 bg-${service.color}-100 rounded-full flex items-center justify-center`}>
                    <service.icon className={`text-${service.color}-500`} />
                  </div>
                  <h3 className="text-xl font-bold">{service.title}</h3>
                </div>
                <p className="text-muted-foreground mb-4">{service.desc}</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>Real-time updates on ferry cancellations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>Transparent pricing with no hidden fees</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-10" />

        {/* Feature Cards Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: MapPin, title: "Comfortable Journey", desc: "A wonderful serenity has taken to the possession of my entire soul." },
            { icon: Plane, title: "Luxuries Hotel", desc: "A wonderful serenity has taken to the possession of my entire soul." },
            { icon: Compass, title: "Travel Guide", desc: "A wonderful serenity has taken to the possession of my entire soul." }
          ].map((item, index) => (
            <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <item.icon className="text-red-500 text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-10" />

        {/* Testimonial Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 relative overflow-hidden">
          <CardContent className="pt-10 pb-16 px-6 text-center relative">
            <div className="absolute top-6 left-6 text-4xl text-cyan-500">“</div>
            <div className="absolute bottom-6 right-6 text-4xl text-cyan-500">”</div>
            
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gray-200 border-2 border-white shadow-md flex items-center justify-center">
                <span className="text-gray-500 font-bold">JM</span>
              </div>
            </div>
            
            <blockquote className="text-xl font-medium max-w-3xl mx-auto mb-6">
              "Their team made our Andaman trip unforgettable — every detail was handled with care and local insight."
            </blockquote>
            
            <p className="text-muted-foreground mb-6">- Jerry Mouse</p>
            
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}