"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import TestimonialCard from "@/components/TestimonialCard";
import StatCard from "@/components/StatCard";
import StepCard from "@/components/StepCard";
import FAQItem from "@/components/FAQItem";
import SectionContainer from "@/components/SectionContainer";
import type {
  TestimonialCardProps,
  StatCardProps,
  StepCardProps,
  FAQItemProps,
} from "@/types";

export default function Home() {
  const testimonials: TestimonialCardProps[] = [
    {
      initial: "K",
      name: "Kwesi",
      location: "Tech Channel • Accra",
      quote:
        "I was stuck at 1,500 watch hours for 8 months. YubeEarn helped me hit 4,000 in just 45 days. Now my channel is monetized and I&apos;m earning from ads!",
      hoursGained: "+2,500 hours",
      colorFrom: "from-blue-50",
      colorTo: "to-blue-600",
      borderColor: "border-blue-600",
      bgColor: "text-blue-600",
    },
    {
      initial: "A",
      name: "Ama",
      location: "Beauty & Lifestyle • Kumasi",
      quote:
        "I didn&apos;t believe it would work, honestly. But the viewers were real, my watch time went up every day, and within 50 days I was monetized.",
      hoursGained: "+2,600 hours",
      colorFrom: "from-pink-50",
      colorTo: "to-pink-600",
      borderColor: "border-pink-600",
      bgColor: "text-pink-600",
    },
    {
      initial: "Y",
      name: "Yaw",
      location: "Gaming Channel • Takoradi",
      quote:
        "I was skeptical about watch time farms. But YubeEarn&apos;s system felt legit. Real people watched, and I hit 4,000 hours. Now I&apos;m earning!",
      hoursGained: "+2,850 hours",
      colorFrom: "from-green-50",
      colorTo: "to-green-600",
      borderColor: "border-green-600",
      bgColor: "text-green-600",
    },
  ];

  const stats: StatCardProps[] = [
    {
      number: "127",
      label: "Creators helped reach monetization",
      colorFrom: "from-blue-50",
      colorTo: "to-blue-100",
      textColor: "text-blue-600",
    },
    {
      number: "45,000+",
      label: "Total watch hours delivered",
      colorFrom: "from-green-50",
      colorTo: "to-green-100",
      textColor: "text-green-600",
    },
    {
      number: "92%",
      label: "Hit their 4,000 hour goal",
      colorFrom: "from-purple-50",
      colorTo: "to-purple-100",
      textColor: "text-purple-600",
    },
  ];

  const steps: StepCardProps[] = [
    {
      number: 1,
      title: "Sign Up (2 minutes)",
      description: "Create account. Verify email. You&apos;re ready.",
    },
    {
      number: 2,
      title: "Pay GHS 29+ (1 minute)",
      description: "Buy a campaign. Use Paystack. Instant activation.",
    },
    {
      number: 3,
      title: "Get Real Viewers (Instant)",
      description: "Real Ghanaians watch your videos. Immediate impact.",
    },
    {
      number: 4,
      title: "Track Progress (Real-time)",
      description:
        "See watch hours increase in your YouTube Studio. Proof included.",
    },
    {
      number: 5,
      title: "Hit 4,000 Hours (30-60 days)",
      description:
        "Qualify for monetization. Enable ads. Start earning from YouTube.",
    },
    {
      number: 6,
      title: "Earn Money (Forever)",
      description: "YouTube AdSense pays you. You&apos;ve scaled your channel.",
    },
  ];

  const faqs: FAQItemProps[] = [
    {
      question: "How much does it cost?",
      answer:
        "Starter: GHS 29 for 500 watch hours. Growth: GHS 49 for 1000 hours. Scale: GHS 99 for 2000 hours. Choose based on your goal.",
    },
    {
      question: "Are the views real?",
      answer:
        "Yes. Real Ghanaian people watch your videos. YouTube counts it as real watch time. Your channel analytics will show the hours increase naturally.",
    },
    {
      question: "How long does it take?",
      answer:
        "30-60 days typically. Depends on your video upload frequency and watch time target. Faster with more uploads.",
    },
    {
      question: "Will YouTube ban me?",
      answer:
        "No. We deliver real watch time from real viewers. YouTube can&apos;t tell the difference. Thousands of creators use services like this safely.",
    },
    {
      question: "What if it doesn't work?",
      answer:
        "92% of creators hit their goal. If you don't see results after 30 days, contact us. We'll work with you to figure it out.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar loginHref="/login" signupHref="/signup" />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-red-600 to-red-700 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight">
            🎬 Reach 4,000 Watch Hours Faster
          </h2>
          <p className="text-lg md:text-2xl mb-4 md:mb-6 opacity-95">
            Real Ghanaian viewers. Real watch time. Real monetization.
          </p>
          <p className="text-base md:text-lg mb-10 md:mb-14 opacity-90 max-w-2xl mx-auto">
            You&apos;re close to YouTube monetization. We help you get there in
            weeks, not months.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/signup?type=creator">
              <button className="w-full md:w-auto bg-white text-red-600 px-6 md:px-8 py-4 md:py-5 rounded-lg font-bold text-base md:text-lg hover:bg-gray-100 transition shadow-lg">
                🎯 I&apos;m a Creator (Help My Channel)
              </button>
            </Link>
            <Link href="/signup?type=earner">
              <button className="w-full md:w-auto bg-transparent border-3 border-white text-white px-6 md:px-8 py-4 md:py-5 rounded-lg font-bold text-base md:text-lg hover:bg-white hover:text-red-600 transition shadow-lg">
                💰 I Want to Earn (Watch Videos)
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <SectionContainer
        title="Real Results from Ghanaian Creators"
        subtitle="Real stories. Real numbers. Real people."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <StatCard key={stat.number} {...stat} />
          ))}
        </div>
      </SectionContainer>

      {/* How It Works */}
      <SectionContainer
        bgColor="bg-gray-100"
        title="How It Works for Creators"
        subtitle="Simple process. Real results. Money paid to viewers who watch."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>
      </SectionContainer>

      {/* Testimonials */}
      <SectionContainer
        title="What Ghanaian Creators Say"
        subtitle="Real stories. Real results. Real people."
      >
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.initial} {...testimonial} />
          ))}
        </div>
      </SectionContainer>

      {/* FAQ */}
      <SectionContainer bgColor="bg-gray-100">
        <h3 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900">
          Common Questions
        </h3>
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} />
          ))}
        </div>
      </SectionContainer>

      {/* Final CTA */}
      <div className="bg-red-600 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Stop Waiting. Start Growing.
          </h3>
          <p className="text-lg md:text-xl opacity-95 mb-10">
            127 Ghanaian creators have already hit 4,000 hours and got
            monetized. Your turn is next.
          </p>
          <Link href="/signup?type=creator">
            <button className="bg-white text-red-600 px-8 md:px-12 py-4 md:py-5 rounded-lg font-bold text-lg md:text-xl hover:bg-gray-100 transition shadow-lg">
              🚀 Start Your Campaign Today
            </button>
          </Link>
          <p className="text-sm opacity-80 mt-4">
            No credit card required. Takes 2 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
