"use client";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

const InboxPrismTestimonials = [
  {
    quote:
      "InboxPrism transformed how I manage my inbox. The AI-powered categorization and smart responses have saved me hours every week!",
    name: "Sarah Wilson",
    title: "Marketing Director",
  },
  {
    quote:
      "The email automation features are incredible. I can now focus on important emails while the AI handles routine responses perfectly.",
    name: "David Rodriguez",
    title: "Sales Manager",
  },
  {
    quote:
      "The smart email summarization helps me quickly understand long email threads. It's like having a personal assistant for my inbox.",
    name: "Jennifer Kim",
    title: "Operations Manager",
  },
  {
    quote:
      "InboxPrism's priority detection ensures I never miss important emails again. The AI understands context better than I expected.",
    name: "Michael Brown",
    title: "Customer Success Lead",
  },
  {
    quote:
      "The analytics dashboard shows me email patterns I never noticed before. It's helped me optimize my communication strategy.",
    name: "Lisa Chen",
    title: "Product Manager",
  },
];

function Testimonials() {
  return (
    <div className="h-[40rem] w-full dark:bg-black dark:bg-grid-white/[0.2] relative flex flex-col items-center justify-center overflow-hidden">
      <h2 className="text-3xl font-bold text-center mb-8 z-10 text-gradient">
        What Our Users Say About InboxPrism
      </h2>
      <div className="flex justify-center w-full overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl">
          <InfiniteMovingCards
            items={InboxPrismTestimonials}
            direction="right"
            speed="slow"
          />
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
