import { LoginForm } from "../features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-4xl">
        <LoginForm />
      </div>
    </div>
  );
}
