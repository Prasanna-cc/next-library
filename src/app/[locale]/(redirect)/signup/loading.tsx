import { SignupFormSkeleton } from "@/components/skeletons/SignupFormSkeletons";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
      <SignupFormSkeleton />
    </div>
  );
}
