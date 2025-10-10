import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Users, 
  Star, 
  Calendar, 
  Award, 
  Shield,
  Plane,
  Waves,
  Mountain,
  Coffee,
  Camera,
  Heart,
  Globe,
  Compass,
  Leaf,
  Sparkles,
  TrendingUp,
  Handshake,
  Sun,
  Moon,
  Map,
  Users2,
  Target,
  Lightbulb,
  Building2,
  Building,
  Award as AwardIcon,
  GraduationCap,
  Crown,
  Heart as HeartIcon,
  Star as StarIcon,
  Sparkle,
} from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen w-full max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-1 rounded-full">
            <div className="bg-white p-1 rounded-full">
              <Waves className="h-16 w-16 text-blue-600" />
            </div>
          </div>
        </div>
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
          About Andaman Travel
        </h1>
        <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Your trusted partner for exploring the pristine beauty of the Andaman Islands
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
          <div className="inline-flex p-3 bg-blue-100 rounded-full mb-3">
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-1">10+</div>
          <div className="text-sm text-muted-foreground">Years Experience</div>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
          <div className="inline-flex p-3 bg-emerald-100 rounded-full mb-3">
            <Users className="h-8 w-8 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-emerald-600 mb-1">300K+</div>
          <div className="text-sm text-muted-foreground">Happy Travelers</div>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
          <div className="inline-flex p-3 bg-amber-100 rounded-full mb-3">
            <AwardIcon className="h-8 w-8 text-amber-600" />
          </div>
          <div className="text-3xl font-bold text-amber-600 mb-1">Top</div>
          <div className="text-sm text-muted-foreground">Rated Service</div>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100">
          <div className="inline-flex p-3 bg-purple-100 rounded-full mb-3">
            <Shield className="h-8 w-8 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-1">100%</div>
          <div className="text-sm text-muted-foreground">Trusted</div>
        </div>
      </div>

      {/* Our Story & Why Choose Us */}
      <div className="grid md:grid-cols-2 gap-10 mb-16">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <span>Our Story</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-lg leading-relaxed">
              Founded over 10 years ago, Andaman Travel has become the most trusted and rated ferry booking service in the Andaman Islands.
            </p>
            <p className="text-lg leading-relaxed">
              We are proud to be the official partner for all ferry operators in Andaman, including Nautika Ferry and Green Ocean Ferry, ensuring you get the best deals and seamless travel experiences.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Star className="h-6 w-6 text-emerald-600" />
              </div>
              <span>Why Choose Us?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {[
                { icon: Mountain, label: "Local Expertise", desc: "Our team of Andaman locals knows every hidden gem" },
                { icon: Shield, label: "Trusted Partner", desc: "Official partner for all major ferry operators" },
                { icon: Plane, label: "Comprehensive Platform", desc: "One-stop solution for ferries, activities, transport & more" },
                { icon: Users, label: "300K+ Served", desc: "Serving over 300,000 visitors annually" }
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="p-2 bg-lime-100 rounded-lg mt-1">
                    <item.icon className="h-5 w-5 text-lime-700" />
                  </div>
                  <div>
                    <Badge variant="secondary" className="bg-lime-100 text-lime-800 mb-1">
                      {item.label}
                    </Badge>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-10" />

      {/* Mission & Team */}
      <div className="grid md:grid-cols-2 gap-10 mb-16">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <span>Our Mission</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">
              To provide personalized, hassle-free travel experiences tailored to meet your unique preferences and needs — whether you're a budget traveler, luxury seeker, adventure enthusiast, or romance explorer.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
              <span>Our Team</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">
              Our team includes experienced local guides, certified diving instructors, logistics coordinators, and customer support specialists — all dedicated to making your Andaman journey unforgettable.
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-10" />

      {/* Services & Achievements */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {[
          { icon: Calendar, title: "10+ Years", desc: "Of Excellence" },
          { icon: Award, title: "Top Rated", desc: "Ferry Service" },
          { icon: Coffee, title: "Local", desc: "Experiences" }
        ].map((item, index) => (
          <Card key={index} className="border-0 shadow-lg">
            <CardContent className="pt-6 text-center">
              <div className="inline-flex p-3 bg-blue-100 rounded-full mb-4">
                <item.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-10" />

      {/* Community Impact */}
      <Card className="border-0 shadow-lg mb-16">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-green-100 rounded-lg">
              <Camera className="h-6 w-6 text-green-600" />
            </div>
            <span>Community Impact</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed">
            We work closely with local communities to promote sustainable tourism and authentic cultural experiences, helping preserve the natural beauty and heritage of the Andaman Islands. Our initiatives include:
          </p>
          <ul className="mt-4 space-y-2 grid md:grid-cols-2">
            <li className="flex items-start gap-2">
              <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span>Supporting local artisans and businesses</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span>Marine conservation programs</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span>Community-based tourism initiatives</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span>Eco-friendly travel practices</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}