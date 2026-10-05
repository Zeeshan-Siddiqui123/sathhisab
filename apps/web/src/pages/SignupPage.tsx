import { SignupForm } from "../features/auth/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-4xl">
        <SignupForm />
      </div>
    </div>
  );
}
