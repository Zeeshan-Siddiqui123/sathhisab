import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Stack } from "@/components/ui/Stack";
import { Text } from "@/components/ui/Text";
import { useSignup } from "../hooks";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});
type FormValues = z.infer<typeof schema>;

export function SignupForm() {
  const navigate = useNavigate();
  const signup = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    await signup.mutateAsync(data);
    navigate("/", { replace: true });
  };

  return (
    <AuthLayout title="Create account">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack className="mt-6">
          {signup.error && (
            <Alert tone="danger" title="Sign up failed">
              {(signup.error as Error).message}
            </Alert>
          )}
          <Input
            id="signup-name"
            label="Full name"
            type="text"
            autoComplete="name"
            autoFocus
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
            {...register("name")}
          />
          <Input
            id="signup-email"
            label="Email"
            type="email"
            autoComplete="email"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
            {...register("email")}
          />
          <PasswordInput
            id="signup-password"
            label="Password"
            autoComplete="new-password"
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
            {...register("password")}
          />
          <Button
            id="signup-submit"
            type="submit"
            color="primary"
            fullWidth
            isLoading={isSubmitting || signup.isPending}
          >
            Create account
          </Button>
          <Text size="sm" className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-primary underline">
              Sign in
            </Link>
          </Text>
        </Stack>
      </form>
    </AuthLayout>
  );
}
