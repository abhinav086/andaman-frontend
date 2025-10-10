import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  User,
  Mail as MailIcon,
  Edit3,
  Globe,
  Smartphone,
  Calendar,
} from "lucide-react";

export default function ContactUs() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text">
          Get in Touch
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Have questions about your Andaman trip? Our friendly support team is here to help you plan the perfect getaway.
          Reach out to us through any of the channels below.
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Card className="border-l-4 border-blue-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Call Us</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">For immediate assistance, call our 24/7 support line:</p>
            <p className="text-2xl font-bold text-blue-600 mb-2">+91 98765 43210</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-2 text-amber-500" />
              <span>Available 24/7, 365 days a year</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-emerald-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <MailIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <CardTitle className="text-xl">Email Us</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">Send us an email for general inquiries or support:</p>
            <p className="text-2xl font-bold text-emerald-600 mb-2">support@andamantravel.com</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-2 text-amber-500" />
              <span>We respond within 24 hours</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-amber-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <MapPin className="h-6 w-6 text-amber-600" />
              </div>
              <CardTitle className="text-xl">Visit Us</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">Visit our office in Port Blair:</p>
            <div className="space-y-2 mb-4">
              <p className="text-sm">
                <strong>Andaman Travel Headquarters</strong><br />
                Main Road, Port Blair<br />
                Andaman & Nicobar Islands<br />
                India - 744101
              </p>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
              <span>Mon-Sat 9AM–6PM</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Chat Section */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-8 mb-16 border border-blue-100">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-3">Need Immediate Help?</h3>
            <p className="text-muted-foreground mb-4">
              Chat with our support team in real-time for urgent booking issues or travel questions.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600">
              <MessageCircle className="mr-2 h-5 w-5" />
              Start Live Chat
            </Button>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-white p-6 rounded-full shadow-lg">
              <MessageCircle className="h-16 w-16 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-t-4 border-blue-500">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Send className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Send Us a Message</CardTitle>
            </div>
            <p className="text-muted-foreground">
              Have specific questions about your travel plans? Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-500" />
                    Full Name
                  </Label>
                  <Input id="name" placeholder="Enter your full name" required className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <MailIcon className="h-4 w-4 text-emerald-500" />
                    Email Address
                  </Label>
                  <Input id="email" type="email" placeholder="your@email.com" required className="h-12" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject" className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4 text-amber-500" />
                  Subject
                </Label>
                <Input id="subject" placeholder="How can we help you?" required className="h-12" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-purple-500" />
                  Your Message
                </Label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us about your travel plans, questions, or concerns..." 
                  rows={6} 
                  required 
                  className="resize-none"
                />
              </div>
              
              <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 h-12">
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted px-4 py-3 rounded-lg">
          <Smartphone className="h-4 w-4 text-blue-500" />
          <span>For urgent ferry or activity booking issues, please use live chat or call us directly.</span>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">How quickly do you respond to emails?</h3>
              <p className="text-muted-foreground text-sm">
                We aim to respond to all emails within 24 hours during business days. Urgent matters are prioritized.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Do you offer 24/7 customer support?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, our phone support is available 24/7. For non-urgent matters, you can email us anytime.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}