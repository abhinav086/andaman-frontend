// src/Pages/Header/ContactUs.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function ContactUs() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
      
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="mr-2 h-5 w-5" /> Call Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">For immediate assistance, call our 24/7 support line:</p>
            <p className="text-lg font-semibold">+91 98765 43210</p>
            <p className="text-sm text-muted-foreground mt-2">Available 24 hours a day, 7 days a week.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" /> Email Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">Send us an email for general inquiries or support:</p>
            <p className="text-lg font-semibold">support@andamantravel.com</p>
            <p className="text-sm text-muted-foreground mt-2">We respond within 24 hours.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" /> Visit Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">Visit our office in Port Blair:</p>
            <p className="text-sm">Andaman Travel Headquarters<br />
            Main Road, Port Blair, Andaman & Nicobar Islands<br />
            India - 744101</p>
            <p className="text-sm text-muted-foreground mt-2">Office Hours: Mon-Sat 9AM–6PM</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Send Us a Message</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Your name" required />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="your@email.com" required />
              </div>
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="How can we help?" required />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Tell us about your travel plans or questions..." rows={5} required />
            </div>
            <Button type="submit" className="w-full">Send Message</Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          For urgent ferry or activity booking issues, please use live chat or call us directly.
        </p>
      </div>
    </div>
  );
}