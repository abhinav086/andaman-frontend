// src/Pages/Header/AboutUs.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Users, Star, Calendar, Award, Shield } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">About Andaman Travel</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your trusted partner for exploring the pristine beauty of the Andaman Islands.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="text-amber-600" /> Our Story
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Founded over 10 years ago, Andaman Travel has become the most trusted and rated ferry booking service in the Andaman Islands.
            </p>
            <p>
              We are proud to be the official partner for all ferry operators in Andaman, including Nautika Ferry and Green Ocean Ferry, ensuring you get the best deals and seamless travel experiences.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="text-emerald-600" /> Why Choose Us?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Badge variant="secondary" className="bg-lime-100 text-lime-800 flex-shrink-0">Local Expertise</Badge>
                <span>Our team of Andaman locals knows every hidden gem.</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="secondary" className="bg-lime-100 text-lime-800 flex-shrink-0">Trusted Partner</Badge>
                <span>Official partner for all major ferry operators.</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="secondary" className="bg-lime-100 text-lime-800 flex-shrink-0">Comprehensive Platform</Badge>
                <span>One-stop solution for ferries, activities, transport & more.</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="secondary" className="bg-lime-100 text-lime-800 flex-shrink-0">300K+ Served</Badge>
                <span>Serving over 300,000 visitors annually.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="mb-6">
            To provide personalized, hassle-free travel experiences tailored to meet your unique preferences and needs — whether you’re a budget traveler, luxury seeker, adventure enthusiast, or romance explorer.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
          <p>
            Our team includes experienced local guides, certified diving instructors, logistics coordinators, and customer support specialists — all dedicated to making your Andaman journey unforgettable.
          </p>
        </div>
      </div>

      <ScrollArea className="mt-8 p-4 bg-muted rounded-lg h-[200px]">
        <h3 className="font-semibold mb-2">Community Impact</h3>
        <p className="text-sm">
          We work closely with local communities to promote sustainable tourism and authentic cultural experiences, helping preserve the natural beauty and heritage of the Andaman Islands.
        </p>
      </ScrollArea>
    </div>
  );
}